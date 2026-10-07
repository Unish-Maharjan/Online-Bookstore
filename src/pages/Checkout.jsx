import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../components/CartContext";
import { apiRequest, getAuthToken } from "../services/api";
import { redirectToEsewaGateway } from "../services/esewa";
import {
  Wallet,
  BookOpen,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useCart();
  const { cartItems } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 100;
  const grandTotal = subtotal + shippingFee;

  useEffect(() => {
    // If eSewa redirected back directly with success parameter
    const dataParam = searchParams.get("data");
    if (dataParam) {
      navigate(`/payment/esewa/success?${searchParams.toString()}`, { replace: true });
      return;
    }

    const statusParam = searchParams.get("status");
    if (statusParam === "esewa_cancelled") {
      setError("Your eSewa transaction was cancelled. No charges were made.");
    }
  }, [searchParams, navigate]);

  const handlePayWithEsewa = async () => {
    if (!getAuthToken()) {
      toast.error("Please sign in before completing your order");
      navigate("/user");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Order
      const order = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!order?._id) {
        throw new Error("Could not initialize order from your cart.");
      }

      // 2. Notify backend of payment initiation if desired
      let initiatedTxnId = null;
      try {
        const initRes = await apiRequest("/api/payments/initiate", {
          method: "POST",
          body: JSON.stringify({ orderId: order._id, paymentMethod: "TEST" }),
        });
        initiatedTxnId = initRes?.data?.transactionId;
      } catch (initErr) {
        console.warn("Initiate payment note:", initErr.message);
      }

      // 3. Redirect to eSewa payment gateway
      await redirectToEsewaGateway({
        orderId: order._id,
        transactionId: initiatedTxnId,
        totalAmount: order.totalAmount || grandTotal,
        successUrl: `${window.location.origin}/payment/esewa/success`,
        failureUrl: `${window.location.origin}/checkout?status=esewa_cancelled`,
      });
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Payment could not be initiated. Please try again."
      );
      setLoading(false);
    }
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#5951e6] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Your Cart is Empty</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Add books to your cart before proceeding to checkout.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5951e6] text-white text-sm font-semibold hover:bg-[#473dbd] transition cursor-pointer"
          >
            <BookOpen size={16} /> Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review your items and complete payment with eSewa.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-semibold">Payment Notice</p>
              <p className="mt-0.5 text-xs sm:text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Items & eSewa (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
                Items ({cartItems.length})
              </h2>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#5951e6] font-bold text-xs flex items-center justify-center shrink-0">
                        {item.quantity}×
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">NPR {item.price} each</p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-slate-900 shrink-0">
                      NPR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Card - eSewa Only */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
                Payment Method
              </h2>

              <div className="p-4 rounded-xl border border-[#60bb46] bg-emerald-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#60bb46] text-white flex items-center justify-center shadow-xs">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900">eSewa Mobile Wallet</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-[#4fa037]">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay online via eSewa secure payment gateway
                    </p>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-full border-2 border-[#60bb46] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#60bb46]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay CTA (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-slate-900">NPR {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-900">
                  {shippingFee === 0 ? "FREE" : `NPR ${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-base">Total</span>
                <span className="font-bold text-xl text-[#60bb46]">
                  NPR {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayWithEsewa}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#60bb46] hover:bg-[#52a63a] text-white font-semibold text-sm transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to eSewa...</span>
                </>
              ) : (
                <>
                  <span>Pay NPR {grandTotal.toFixed(2)} with eSewa</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              You will be redirected to eSewa to complete your payment securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
