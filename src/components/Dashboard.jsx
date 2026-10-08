import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "./CartContext";
import { useGetBooksQuery } from "../services/bookApi";
import { apiRequest, getAuthToken, removeAuthToken } from "../services/api";
import {
  BookOpen,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User as UserIcon,
  LogOut,
  Clock,
  Star,
  ChevronRight,
  Search,
  RefreshCw,
  Copy,
  Mail,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Trash2,
} from "lucide-react";

// Session Helper
class DashboardSession {
  static getUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }

  static getToken() {
    return getAuthToken();
  }

  static logout(navigate) {
    removeAuthToken();
    localStorage.removeItem("user");
    toast.success("Successfully logged out.", { duration: 2000 });
    navigate("/user");
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = DashboardSession.getToken();
  const storedUser = DashboardSession.getUser();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to access your dashboard");
      navigate("/user");
    }
  }, [token, navigate]);

  // Context & API Data
  const { state: cartState, addToCart } = useCart();
  const { data: booksData = [], isLoading: booksLoading } = useGetBooksQuery();

  // User details & navigation state
  const [user, setUser] = useState(storedUser);
  const [activeTab, setActiveTab] = useState("overview");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Wishlist State
  const wishlistKey = `bookstore_wishlist_${user.id || user.email || "guest"}`;
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    } catch {
      return [];
    }
  });

  // User Profile Form State
  const profileKey = `bookstore_profile_extra_${user.id || user.email || "guest"}`;
  const [profileForm, setProfileForm] = useState(() => {
    try {
      const extra = JSON.parse(localStorage.getItem(profileKey) || "{}");
      return {
        name: user.name || "",
        email: user.email || "",
        phone: extra.phone || "",
        street: extra.street || "",
        city: extra.city || "",
        postalCode: extra.postalCode || "",
        country: extra.country || "Nepal",
        genres: extra.genres || ["Fiction", "Technology"],
      };
    } catch {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: "",
        street: "",
        city: "",
        postalCode: "",
        country: "Nepal",
        genres: ["Fiction", "Technology"],
      };
    }
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Available literary genres
  const allGenres = [
    "Fiction",
    "Self-Help",
    "Business",
    "Technology",
    "Sci-Fi",
    "Fantasy",
    "Philosophy",
    "Mystery",
    "Psychology",
    "Biography",
  ];

  // Fetch orders from backend
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await apiRequest("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrdersError(err.message || "Failed to load order history.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, wishlistKey]);

  // Computed metrics
  const totalOrdersCount = orders.length;
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount) || 0);
    }, 0);
  }, [orders]);

  const cartItemsCount = useMemo(() => {
    return (cartState?.cartItems || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  }, [cartState?.cartItems]);

  const cartSubtotal = useMemo(() => {
    return (cartState?.cartItems || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cartState?.cartItems]);

  // Wishlist handler
  const handleToggleWishlist = (book) => {
    const exists = wishlist.some((item) => item._id === book._id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item._id !== book._id));
      toast.success(`Removed "${book.title}" from wishlist`);
    } else {
      setWishlist((prev) => [
        ...prev,
        {
          _id: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          rating: book.rating,
          image: book.image,
          category: book.category,
        },
      ]);
      toast.success(`Added "${book.title}" to wishlist`);
    }
  };

  // Add to cart
  const handleAddToCart = async (book) => {
    try {
      const success = await addToCart(book);
      if (success !== false) {
        toast.success(`"${book.title}" added to cart`);
      }
    } catch {
      toast.error("Could not add book to cart");
    }
  };

  // Move book from wishlist to cart
  const handleMoveWishlistToCart = async (book) => {
    await handleAddToCart(book);
    setWishlist((prev) => prev.filter((item) => item._id !== book._id));
  };

  // Save Profile Form
  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        name: profileForm.name,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem(
        profileKey,
        JSON.stringify({
          phone: profileForm.phone,
          street: profileForm.street,
          city: profileForm.city,
          postalCode: profileForm.postalCode,
          country: profileForm.country,
          genres: profileForm.genres,
        })
      );
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Could not save profile details");
    }
  };

  // Toggle genre preference
  const toggleGenre = (genre) => {
    setProfileForm((prev) => {
      const exists = prev.genres.includes(genre);
      return {
        ...prev,
        genres: exists
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      };
    });
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        orderFilter === "all" ||
        (orderFilter === "paid" &&
          (order.paymentStatus === "PAID" || order.status === "PAID")) ||
        (orderFilter === "pending" &&
          (order.paymentStatus === "PENDING" ||
            order.status === "PENDING_PAYMENT"));

      const searchLower = orderSearch.toLowerCase();
      const matchesSearch =
        !orderSearch ||
        order._id?.toLowerCase().includes(searchLower) ||
        order.items?.some((item) => item.title?.toLowerCase().includes(searchLower));

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // Recommended books
  const recommendedBooks = useMemo(() => {
    if (!booksData || booksData.length === 0) return [];
    return [...booksData].slice(0, 4);
  }, [booksData]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-[Poppins] text-slate-800 pb-16">
      {/* TOP USER HEADER */}
      <section className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-sm">
              {user.name ? user.name.charAt(0) : "U"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.name || "My Account"}
                </h1>
                {user.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                  >
                    <ShieldCheck size={12} /> Admin
                  </Link>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail size={13} className="opacity-70" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/books"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 transition-colors"
            >
              Browse Books
            </Link>

            <Link
              to="/cart"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-medium text-white transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart size={15} />
              <span>Cart ({cartItemsCount})</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </section>

      {/* METRIC STATS STRIP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Total Orders</span>
              <ShoppingBag size={16} className="text-indigo-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {totalOrdersCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Orders placed</p>
          </div>

          {/* Card 2: Total Spent */}
          <div
            onClick={() => setActiveTab("orders")}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Total Spent</span>
              <CreditCard size={16} className="text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              NPR {totalSpent.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">All orders total</p>
          </div>

          {/* Card 3: Cart */}
          <Link
            to="/cart"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Cart</span>
              <ShoppingCart size={16} className="text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {cartItemsCount}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              NPR {cartSubtotal.toFixed(2)}
            </p>
          </Link>

          {/* Card 4: Wishlist */}
          <div
            onClick={() => setActiveTab("wishlist")}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Wishlist</span>
              <Heart size={16} className="text-rose-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {wishlist.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Saved items</p>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>My Orders</span>
            {orders.length > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === "orders"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "wishlist"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === "wishlist"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === "profile"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Profile & Address
          </button>
        </div>
      </section>

      {/* TAB CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Latest Order Spotlight */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">Latest Order</h2>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    View all orders ({orders.length}) <ChevronRight size={13} />
                  </button>
                )}
              </div>

              {ordersLoading ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw size={15} className="animate-spin text-indigo-600" />
                  <span>Loading order details...</span>
                </div>
              ) : orders.length > 0 ? (
                (() => {
                  const latest = orders[0];
                  const isPaid =
                    latest.paymentStatus === "PAID" || latest.status === "PAID";
                  return (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <p className="text-xs text-slate-400">Order ID</p>
                          <p className="font-mono text-sm font-bold text-slate-800">
                            #{latest._id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Date</p>
                          <p className="text-xs font-medium text-slate-700">
                            {new Date(latest.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Total</p>
                          <p className="text-sm font-bold text-slate-900">
                            {latest.currency || "NPR"} {Number(latest.totalAmount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {latest.paymentStatus || latest.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {latest.items?.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-100"
                          >
                            <span className="font-medium text-slate-800 truncate">
                              {item.title} <span className="text-slate-400">× {item.quantity}</span>
                            </span>
                            <span className="font-semibold text-slate-900 shrink-0 ml-2">
                              {latest.currency || "NPR"} {item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-sm">You haven't placed any orders yet.</p>
                  <Link
                    to="/books"
                    className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>

            {/* Recommended Books */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">Featured Books</h2>
                <Link
                  to="/books"
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  All Books <ChevronRight size={13} />
                </Link>
              </div>

              {booksLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Loading books...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommendedBooks.map((book) => (
                    <div
                      key={book._id}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 mb-2">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                              📖
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-xs text-slate-900 line-clamp-1">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {book.author}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          NPR {book.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(book)}
                          className="px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: MY ORDERS ==================== */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by Order ID or Book..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setOrderFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    orderFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter("paid")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    orderFilter === "paid"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setOrderFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    orderFilter === "pending"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={fetchOrders}
                  title="Refresh"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 ml-1"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Loading orders...
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isPaid =
                    order.paymentStatus === "PAID" || order.status === "PAID";
                  return (
                    <article
                      key={order._id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400">Order ID: </span>
                          <span className="font-mono font-bold text-slate-800">
                            #{order._id}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Date: </span>
                          <span className="font-medium text-slate-700">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Total: </span>
                          <span className="font-bold text-slate-900">
                            {order.currency || "NPR"} {Number(order.totalAmount).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.paymentStatus || order.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 divide-y divide-slate-50">
                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="py-2 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-slate-800">
                              {item.title} <span className="text-slate-400">× {item.quantity}</span>
                            </span>
                            <span className="font-semibold text-slate-800">
                              {order.currency || "NPR"} {item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No orders found.
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: WISHLIST ==================== */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Saved Wishlist</h2>
                <p className="text-xs text-slate-400">{wishlist.length} item(s) saved</p>
              </div>

              {wishlist.length > 0 && (
                <button
                  onClick={() => {
                    setWishlist([]);
                    toast.success("Wishlist cleared");
                  }}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {wishlist.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 mb-2">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                            📖
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-xs text-slate-900 line-clamp-1">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{book.author}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        NPR {book.price}
                      </span>
                      <button
                        onClick={() => handleMoveWishlistToCart(book)}
                        className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold"
                      >
                        To Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Your wishlist is empty.
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: PROFILE & ADDRESS ==================== */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 max-w-2xl"
          >
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-xl px-3 py-2 text-xs cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="e.g. 9801234567"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={profileForm.street}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, street: e.target.value }))
                    }
                    placeholder="Street / Area / Landmark"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="City / District"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={profileForm.postalCode}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, postalCode: e.target.value }))
                    }
                    placeholder="Postal Code"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Sign Out of Account
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Sign Out</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to sign out of your account?
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  DashboardSession.logout(navigate);
                }}
                className="py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}