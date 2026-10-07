import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Receipt,
  ArrowRight,
  BookOpen,
  Copy,
  Printer,
  ShieldCheck,
  Wallet,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../components/CartContext";
import { decodeEsewaResponse, verifyEsewaPayment } from "../services/esewa";

export default function EsewaSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");

  const rawData = searchParams.get("data");

  useEffect(() => {
    async function processEsewaReturn() {
      if (!rawData) {
        setError("No payment data found in URL. If you cancelled, please return to checkout.");
        setLoading(false);
        return;
      }

      try {
        const decoded = decodeEsewaResponse(rawData);
        if (!decoded) {
          throw new Error("Unable to decode the eSewa response packet.");
        }

        if (decoded.status !== "COMPLETE") {
          throw new Error(`eSewa reported status: ${decoded.status || "INCOMPLETE"}`);
        }

        // Verify with backend
        const verification = await verifyEsewaPayment({
          transactionId: decoded.transaction_uuid,
          rawData,
          decoded,
        });

        if (verification?.success) {
          // Clear cart on successful purchase
          if (typeof clearCart === "function") {
            try {
              await clearCart();
            } catch (cartErr) {
              console.warn("Cart clear note:", cartErr);
            }
          }

          setPaymentInfo({
            transactionCode: decoded.transaction_code || verification.data?.transactionCode || "N/A",
            transactionUuid: decoded.transaction_uuid,
            totalAmount: decoded.total_amount || verification.data?.amount,
            productCode: decoded.product_code || "EPAYTEST",
            status: "PAID",
            timestamp: new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        } else {
          throw new Error(verification?.message || "Failed to confirm payment status.");
        }
      } catch (err) {
        console.error("eSewa completion error:", err);
        setError(err.message || "Failed to process eSewa verification.");
      } finally {
        setLoading(false);
      }
    }

    processEsewaReturn();
  }, [rawData, clearCart]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!", { duration: 1500 });
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100 space-y-5 animate-pulse">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-[#60bb46] flex items-center justify-center animate-spin">
              <Clock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Verifying eSewa Transaction...
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Confirming transaction authenticity and registering your order. This takes only a moment.
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-100 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Verification Notice</h2>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                to="/checkout"
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Return to Checkout
              </Link>
              <Link
                to="/orders"
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                View Order History
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#60bb46] to-[#4fa037] p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-white mb-1">
                  <CheckCircle2 size={36} className="animate-bounce" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                  eSewa UAT Sandbox Verified
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  eSewa Transaction Successful!
                </h1>
                <p className="text-emerald-50 text-sm max-w-md mx-auto">
                  Thank you! Your payment with eSewa dummy account was processed and verified.
                </p>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Amount spotlight */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Amount Paid
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">
                    NPR {Number(paymentInfo?.totalAmount || 0).toFixed(2)}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-center">
                  <ShieldCheck size={16} />
                  <span>Payment Status: PAID</span>
                </div>
              </div>

              {/* Transaction Key-Values */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Receipt size={16} className="text-slate-400" />
                    eSewa Ref (Code)
                  </span>
                  <div className="flex items-center gap-2 font-mono font-bold text-slate-800">
                    <span>{paymentInfo?.transactionCode}</span>
                    <button
                      onClick={() =>
                        copyToClipboard(paymentInfo?.transactionCode, "ref")
                      }
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy eSewa Reference"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    Transaction UUID
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
                    <span className="max-w-[180px] sm:max-w-[260px] truncate">
                      {paymentInfo?.transactionUuid}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(paymentInfo?.transactionUuid, "uuid")
                      }
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                      title="Copy Transaction UUID"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Wallet size={16} className="text-slate-400" />
                    Payment Gateway
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#60bb46]" />
                    eSewa ePay (v2 Sandbox)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Merchant Code</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {paymentInfo?.productCode}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Completed At</span>
                  <span className="font-semibold text-slate-800">
                    {paymentInfo?.timestamp}
                  </span>
                </div>
              </div>

              {/* Dummy Account Note */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 flex items-start gap-3">
                <Sparkles size={18} className="text-[#60bb46] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Test Sandbox Verification Complete</p>
                  <p className="text-emerald-700">
                    Your test payment was accepted by eSewa's sandbox. The books in your cart have been ordered and your order status is marked as <strong>PAID</strong>.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/orders"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#60bb46] hover:bg-[#52a63a] text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>View in My Orders</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/books"
                  className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen size={17} />
                  <span>Browse Books</span>
                </Link>

                <button
                  onClick={handlePrint}
                  className="py-3.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
                  title="Print Receipt"
                >
                  <Printer size={17} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
