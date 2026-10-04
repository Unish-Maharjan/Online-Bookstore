import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, getAuthToken } from "../services/api";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/user");
      return;
    }
    apiRequest("/api/orders")
      .then(setOrders)
      .catch((requestError) => setError(requestError.message));
  }, [navigate]);

  return (
    <main className="min-h-screen bg-[#f3f4f8] px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {!error && orders.length === 0 && <p className="mt-6 text-slate-500">No orders yet.</p>}
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-3">
                <p className="font-semibold">Order {order._id}</p>
                <p className={order.paymentStatus === "PAID" ? "font-semibold text-emerald-600" : "font-semibold text-amber-600"}>{order.paymentStatus}</p>
              </div>
              <p className="mt-2 text-sm text-slate-500">{order.items.length} item(s) · {order.currency} {order.totalAmount}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
