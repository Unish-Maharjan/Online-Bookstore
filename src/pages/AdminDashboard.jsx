import { useState } from "react";
import { useGetBooksQuery } from "../services/bookApi";
import { Link } from "react-router";


export default function AdminDashboard() {
  // track which nav item is selected
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const {data} = useGetBooksQuery();

  return (
    <div className="flex bg-slate-50 font-[Poppins]">

      <aside className="w-56 shrink-0 bg-white border-r border-slate-100 p-4 flex flex-col gap-2">

        
        <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-300 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-400">admin@bookstore.com</p>
          </div>
        </div>


        <Link to='/addbooks'><button>Add books</button></Link>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-8">


          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-400 text-sm mt-1">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <p className="text-xs text-slate-400 bg-white border border-slate-100 px-3 
            py-2 rounded-lg shadow-sm">
              Last updated: Just now
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">📚</div>
                <span className="text-xs font-semibold text-emerald-500">↗ +12%</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">Total Books</p>
              <p className="text-2xl font-bold text-slate-900">1,234</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-lg">💵</div>
                <span className="text-xs font-semibold text-emerald-500">↗ +23%</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-slate-900">$45,678</p>
            </div>

            {/* Orders */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🛒</div>
                <span className="text-xs font-semibold text-emerald-500">↗ +8%</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">Orders</p>
              <p className="text-2xl font-bold text-slate-900">567</p>
            </div>

            {/* Customers */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-lg">👥</div>
                <span className="text-xs font-semibold text-red-400">↘ -3%</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">Customers</p>
              <p className="text-2xl font-bold text-slate-900">2,345</p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-5 h-150 overflow-hidden">

            {/* Top selling books */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Top Selling Books</h2>
                <button className="text-xs text-indigo-600 font-semibold hover:underline ">View All ↗</button>
              </div>

              {data?.map((data) => (
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                  </span>
                  <span className="text-xl"><img src={data.image} className="h-7"/></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{data.title}</p>
                    <p className="text-xs text-slate-400">{data.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">${data.price}</p>
                    <p className="text-xs text-amber-400">★ {data.rating}</p>
                  </div>
                </div>
              ))};
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-800">Recent Orders</h2>
                <button className="text-xs text-indigo-600 font-semibold hover:underline">View All ↗</button>
              </div>

              <div className="space-y-3">

                <div className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">John Doe</p>
                      <p className="text-xs text-slate-400">Atomic Habits</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">$27.99</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Completed</span>
                    <span className="text-xs text-slate-400">5 mins ago</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Jane Smith</p>
                      <p className="text-xs text-slate-400">Clean Code</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">$45.99</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Processing</span>
                    <span className="text-xs text-slate-400">12 mins ago</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Mike Johnson</p>
                      <p className="text-xs text-slate-400">Sapiens</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">$29.99</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Shipped</span>
                    <span className="text-xs text-slate-400">1 hour ago</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Emily Brown</p>
                      <p className="text-xs text-slate-400">The Midnight Library</p>
                    </div>
                    <p className="text-sm font-bold text-indigo-600">$24.99</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Completed</span>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ============================
              QUICK ACTION BUTTONS
          ============================ */}
          <div className="grid grid-cols-3 gap-5">

            <div
              className="rounded-2xl p-6 text-white cursor-pointer shadow-md hover:-translate-y-1 transition-transform"
              style={{ background: "linear-gradient(135deg, #5e3fd9, #6d52ed)" }}
            >
              <p className="text-3xl mb-3">📦</p>
              <p className="font-bold text-lg">Add New Book</p>
              <p className="text-sm opacity-75 mt-1">Add books to your inventory</p>
            </div>

            <div
              className="rounded-2xl p-6 text-white cursor-pointer shadow-md hover:-translate-y-1 transition-transform"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              <p className="text-3xl mb-3">🛒</p>
              <p className="font-bold text-lg">Manage Orders</p>
              <p className="text-sm opacity-75 mt-1">View and process orders</p>
            </div>

            <div
              className="rounded-2xl p-6 text-white cursor-pointer shadow-md hover:-translate-y-1 transition-transform"
              style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
            >
              <p className="text-3xl mb-3">👥</p>
              <p className="font-bold text-lg">View Customers</p>
              <p className="text-sm opacity-75 mt-1">Manage customer accounts</p>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}