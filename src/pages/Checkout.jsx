import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { apiRequest, getAuthToken } from "../services/api";

function getErrorMessage(error) {
  if (error?.status === 401) return "Please sign in before checking out.";
  if (error?.status === 403) return "You are not allowed to complete this payment.";
  if (error?.status === 404) return "The order or payment could not be found.";
  if (error?.status === 409) return error.message;
  return error?.message || "Payment could not be completed. Please try again.";
}

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useCart();
  const { cartItems } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);

  const startPayment = async () => {
    if (!getAuthToken()) {
      navigate("/user");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const order = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const initiated = await apiRequest("/api/payments/initiate", {
        method: "POST",
        body: JSON.stringify({ orderId: order._id, paymentMethod: "TEST" }),
      });
      const verified = await apiRequest("/api/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          transactionId: initiated.data.transactionId,
          success: true,
        }),
      });

      if (!verified?.success || verified.data?.status !== "COMPLETED") {
        throw new Error("Payment verification failed.");
      }
      setPayment(verified.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  if (payment) {
    return (
      <main className="min-h-screen bg-[#f3f4f8] px-6 py-12">
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-4xl text-emerald-500">✓</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Payment Successful</h1>
          <p className="mt-2 text-slate-500">Your order has been marked as paid by the backend.</p>
          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Transaction ID</dt><dd className="break-all text-right font-semibold">{payment.transactionId}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Order ID</dt><dd className="break-all text-right font-semibold">{payment.orderId}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Amount</dt><dd className="font-semibold">{payment.currency} {payment.amount}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-semibold text-emerald-600">{payment.status}</dd></div>
          </dl>
          <button onClick={() => navigate("/orders")} className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
            View Order History
          </button>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f3f4f8] px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <Link to="/books" className="mt-6 inline-block text-indigo-600">Browse books</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f4f8] px-6 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <div className="mt-6 space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span>{item.title} × {item.quantity}</span>
              <span className="font-semibold">NPR {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-500">The backend calculates the final order amount from your cart.</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <button onClick={startPayment} disabled={loading} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Processing payment..." : "Proceed to Payment"}
        </button>
      </section>
    </main>
  );
}
