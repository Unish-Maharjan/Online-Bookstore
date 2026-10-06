import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "./CartContext";
import { useGetBooksQuery } from "../services/bookApi";
import { apiRequest, getAuthToken } from "../services/api";
import {
  BookOpen,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Clock,
  Star,
  Sparkles,
  ChevronRight,
  Search,
  Award,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  HelpCircle,
  Truck,
  CreditCard,
  Target,
  Flame,
  Trash2,
  ExternalLink,
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
    return localStorage.getItem("token");
  }

  static logout(navigate) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Successfully logged out. See you soon!", {
      icon: "👋",
      duration: 3000,
    });
    navigate("/user");
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token = DashboardSession.getToken();
  const storedUser = DashboardSession.getUser();

  // If not logged in, redirect immediately to login
  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to access your dashboard");
      navigate("/user");
    }
  }, [token, navigate]);

  // Context & API Data
  const { state: cartState, addToCart } = useCart();
  const { data: booksData = [], isLoading: booksLoading } = useGetBooksQuery();

  // User details state
  const [user, setUser] = useState(storedUser);
  const [activeTab, setActiveTab] = useState("overview");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Wishlist State (persisted per user)
  const wishlistKey = `bookstore_wishlist_${user.id || user.email || "guest"}`;
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    } catch {
      return [];
    }
  });

  // Reading Goal State (persisted per user)
  const goalKey = `bookstore_reading_goal_${user.id || user.email || "guest"}`;
  const [readingGoal, setReadingGoal] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(goalKey) ||
          JSON.stringify({
            target: 15,
            completed: 4,
            currentBook: "The Psychology of Money",
            currentProgress: 68,
          })
      );
    } catch {
      return {
        target: 15,
        completed: 4,
        currentBook: "The Psychology of Money",
        currentProgress: 68,
      };
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
        phone: extra.phone || "+977 9801234567",
        street: extra.street || "Kathmandu Durbar Square Area",
        city: extra.city || "Kathmandu",
        postalCode: extra.postalCode || "44600",
        country: extra.country || "Nepal",
        genres: extra.genres || ["Self-Help", "Fiction", "Technology"],
      };
    } catch {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: "+977 9801234567",
        street: "Kathmandu Durbar Square Area",
        city: "Kathmandu",
        postalCode: "44600",
        country: "Nepal",
        genres: ["Self-Help", "Fiction", "Technology"],
      };
    }
  });

  const [copiedToken, setCopiedToken] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Available literary genres for preferences
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

  // Sync reading goal to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(goalKey, JSON.stringify(readingGoal));
    } catch (e) {
      console.error(e);
    }
  }, [readingGoal, goalKey]);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: "☀️" };
    if (hour < 17) return { text: "Good afternoon", icon: "🌤️" };
    if (hour < 22) return { text: "Good evening", icon: "🌙" };
    return { text: "Late night reading", icon: "✨" };
  }, []);

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

  // Reader Rewards points calculation (base 100 bonus + 1 point per NPR 25 spent)
  const rewardPoints = useMemo(() => {
    return 120 + Math.floor(totalSpent / 25);
  }, [totalSpent]);

  // Reader tier badge
  const readerTier = useMemo(() => {
    if (totalOrdersCount >= 10 || totalSpent >= 5000)
      return { name: "Master Bibliophile", color: "from-amber-500 to-orange-500", icon: "👑" };
    if (totalOrdersCount >= 3 || totalSpent >= 1500)
      return { name: "Avid Reader", color: "from-indigo-500 to-purple-500", icon: "📖" };
    return { name: "Book Explorer", color: "from-emerald-500 to-teal-500", icon: "🌱" };
  }, [totalOrdersCount, totalSpent]);

  // Wishlist handler
  const handleToggleWishlist = (book) => {
    const exists = wishlist.some((item) => item._id === book._id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item._id !== book._id));
      toast.success(`Removed "${book.title}" from saved wishlist`, { icon: "💔" });
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
      toast.success(`Added "${book.title}" to saved wishlist!`, {
        icon: "❤️",
        style: { background: "#fff5f5", color: "#e11d48" },
      });
    }
  };

  // Add to cart with feedback
  const handleAddToCart = async (book) => {
    try {
      await addToCart(book);
      toast.success(`"${book.title}" added to your cart!`, {
        icon: "🛒",
        style: { background: "#ecfdf3", color: "#12923d" },
      });
    } catch {
      toast.error("Could not add book to cart. Please retry.");
    }
  };

  // Move book from wishlist to cart
  const handleMoveWishlistToCart = async (book) => {
    await handleAddToCart(book);
    setWishlist((prev) => prev.filter((item) => item._id !== book._id));
    toast.success("Moved from wishlist to cart!");
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
      toast.success("Profile & shipping preferences updated!", {
        icon: "✨",
      });
    } catch {
      toast.error("Could not save profile details.");
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

  // Copy token
  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      toast.success("Session token copied to clipboard!");
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        orderFilter === "all" ||
        (orderFilter === "paid" && (order.paymentStatus === "PAID" || order.status === "PAID")) ||
        (orderFilter === "pending" && (order.paymentStatus === "PENDING" || order.status === "PENDING_PAYMENT"));

      const searchLower = orderSearch.toLowerCase();
      const matchesSearch =
        !orderSearch ||
        order._id?.toLowerCase().includes(searchLower) ||
        order.items?.some((item) => item.title?.toLowerCase().includes(searchLower));

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // Recommended books (picks 4 books)
  const recommendedBooks = useMemo(() => {
    if (!booksData || booksData.length === 0) return [];
    return [...booksData].slice(0, 4);
  }, [booksData]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins] text-slate-800 pb-16">
      {/* TOP HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#2a2468] via-[#473dbd] to-[#6054f0] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 shadow-md">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-[#f59e0b]/15 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Greeting & Avatar */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-300 p-1 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold uppercase tracking-wider">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                </div>
                <span
                  title="Online"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#2a2468] flex items-center justify-center text-[10px]"
                >
                  ✓
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm text-indigo-200 font-medium flex items-center gap-1.5">
                    <span>{greeting.icon}</span> {greeting.text},
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${readerTier.color} text-white shadow-xs`}
                  >
                    <span>{readerTier.icon}</span>
                    <span>{readerTier.name}</span>
                  </span>
                  {user.role === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors"
                    >
                      <ShieldCheck size={12} /> Admin Portal
                    </Link>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {user.name || "Book Enthusiast"}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-indigo-200">
                  <span className="flex items-center gap-1">
                    <Mail size={14} className="opacity-80" />
                    {user.email}
                  </span>
                  <span className="text-indigo-300/60">•</span>
                  <span className="flex items-center gap-1">
                    <Award size={14} className="text-amber-300" />
                    {rewardPoints} Reward Points
                  </span>
                  <span className="text-indigo-300/60">•</span>
                  <span className="text-emerald-300 font-medium">Verified Reader</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons in header */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-sm font-semibold text-white border border-white/20 transition-all shadow-sm hover:shadow"
              >
                <BookOpen size={16} />
                <span>Explore Books</span>
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-all shadow-sm hover:shadow"
              >
                <ShoppingCart size={16} />
                <span>Cart ({cartItemsCount})</span>
              </Link>

              <button
                onClick={() => setShowLogoutModal(true)}
                title="Log out"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-300/30 text-red-100 text-sm font-semibold transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STATS STRIP (Overlapping hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-9 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className="cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                My Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShoppingBag size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalOrdersCount}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Lifetime purchases</span>
              <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                View <ChevronRight size={12} />
              </span>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div
            onClick={() => setActiveTab("orders")}
            className="cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Book Investment
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CreditCard size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              NPR {totalSpent.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Sparkles size={12} /> Value read
              </span>
              <span className="text-slate-400">Total</span>
            </div>
          </div>

          {/* Card 3: Cart Preview */}
          <Link
            to="/cart"
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Cart
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <ShoppingCart size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {cartItemsCount} <span className="text-sm font-semibold text-slate-400">items</span>
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>NPR {cartSubtotal.toFixed(2)}</span>
              <span className="text-amber-600 font-semibold group-hover:underline flex items-center gap-0.5">
                Checkout <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Card 4: Rewards / Wishlist */}
          <div
            onClick={() => setActiveTab("wishlist")}
            className="cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Saved Wishlist
              </span>
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Heart size={18} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {wishlist.length} <span className="text-sm font-semibold text-slate-400">books</span>
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Saved for later</span>
              <span className="text-pink-600 font-semibold group-hover:underline flex items-center gap-0.5">
                Explore <ChevronRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD TABS NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Sparkles size={16} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "orders"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ShoppingBag size={16} />
            My Orders
            {orders.length > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold ${
                  activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "wishlist"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Heart size={16} />
            Wishlist
            {wishlist.length > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold ${
                  activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-pink-100 text-pink-600"
                }`}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "tracker"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Target size={16} />
            Reading Goals
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "profile"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <User size={16} />
            Profile & Address
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === "support"
                ? "bg-[#5951e6] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <HelpCircle size={16} />
            Perks & Support
          </button>
        </div>
      </section>

      {/* MAIN TAB CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ======================= TAB: OVERVIEW ======================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Action Hub */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Link
                to="/books"
                className="bg-gradient-to-br from-[#5951e6] to-[#7971f0] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg leading-snug">Browse Catalog</h3>
                  <p className="text-xs text-indigo-100 mt-1">Discover bestselling titles</p>
                </div>
                <span className="text-xs font-semibold text-indigo-200 mt-4 flex items-center gap-1">
                  Shop now <ArrowRight size={13} />
                </span>
              </Link>

              <div
                onClick={() => setActiveTab("orders")}
                className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Truck size={20} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 leading-snug">
                    Track Orders
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Check current delivery status</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 mt-4 flex items-center gap-1">
                  View orders <ChevronRight size={13} />
                </span>
              </div>

              <div
                onClick={() => setActiveTab("tracker")}
                className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Flame size={20} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 leading-snug">
                    Reading Streak
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {readingGoal.completed} of {readingGoal.target} books done
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-600 mt-4 flex items-center gap-1">
                  Update goal <ChevronRight size={13} />
                </span>
              </div>

              <div
                onClick={() => setActiveTab("profile")}
                className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 leading-snug">
                    Saved Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{profileForm.city}, {profileForm.country}</p>
                </div>
                <span className="text-xs font-semibold text-purple-600 mt-4 flex items-center gap-1">
                  Edit address <ChevronRight size={13} />
                </span>
              </div>
            </div>

            {/* Split row: Latest Order Highlight & 2026 Reading Challenge */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Order Spotlight (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      📦
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Latest Order</h2>
                      <p className="text-xs text-slate-400">Your most recent bookstore activity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-[#5951e6] hover:underline flex items-center gap-1"
                  >
                    View All ({orders.length}) <ChevronRight size={14} />
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <RefreshCw className="animate-spin text-indigo-600" size={24} />
                    <span className="text-sm">Retrieving your orders...</span>
                  </div>
                ) : orders.length > 0 ? (
                  (() => {
                    const latest = orders[0];
                    const isPaid =
                      latest.paymentStatus === "PAID" || latest.status === "PAID";
                    return (
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
                          <div>
                            <span className="text-xs text-slate-400 font-medium">Order ID</span>
                            <p className="font-mono text-sm font-bold text-slate-800">
                              #{latest._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-medium">Total Amount</span>
                            <p className="text-base font-extrabold text-[#5951e6]">
                              {latest.currency || "NPR"} {Number(latest.totalAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                isPaid
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {latest.paymentStatus || latest.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-4 space-y-2.5">
                          {latest.items?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-100"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  {idx + 1}
                                </div>
                                <span className="font-medium text-slate-800 truncate">
                                  {item.title}
                                </span>
                              </div>
                              <div className="text-right shrink-0 text-xs sm:text-sm">
                                <span className="text-slate-400 mr-2">Qty: {item.quantity}</span>
                                <span className="font-bold text-slate-900">
                                  NPR {item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                          {latest.items?.length > 3 && (
                            <p className="text-xs text-slate-400 text-center pt-1">
                              + {latest.items.length - 3} more item(s)
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> Placed on:{" "}
                            {new Date(latest.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            onClick={() => setActiveTab("orders")}
                            className="font-semibold text-[#5951e6] hover:underline"
                          >
                            Full Details →
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-3xl mb-2">📚</p>
                    <h3 className="font-bold text-slate-800 text-base">No orders yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                      Your personal shelf is ready! Browse our collection of bestsellers and start
                      your literary journey today.
                    </p>
                    <Link
                      to="/books"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5951e6] text-white text-xs font-semibold hover:bg-[#473dbd] transition-colors"
                    >
                      <BookOpen size={14} /> Start Shopping
                    </Link>
                  </div>
                )}
              </div>

              {/* Reading Tracker Widget (1 Col) */}
              <div className="bg-gradient-to-br from-indigo-900 via-[#3b3394] to-[#241c6b] text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="text-amber-400" size={20} />
                      <h3 className="font-bold text-base">Reading Challenge</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">
                      2026
                    </span>
                  </div>

                  <p className="text-xs text-indigo-200">
                    Track your annual reading goals and stay motivated!
                  </p>

                  {/* Circular or linear progress */}
                  <div className="mt-6 mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-3xl font-extrabold text-white">
                        {readingGoal.completed}{" "}
                        <span className="text-base font-normal text-indigo-300">
                          / {readingGoal.target} books
                        </span>
                      </span>
                      <span className="text-sm font-bold text-amber-400">
                        {Math.round((readingGoal.completed / readingGoal.target) * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((readingGoal.completed / readingGoal.target) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Currently Reading */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 mt-4">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                      Currently Reading
                    </span>
                    <p className="font-bold text-sm text-white mt-0.5 truncate">
                      {readingGoal.currentBook}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-indigo-200">
                      <span>Progress</span>
                      <span className="font-semibold text-white">{readingGoal.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${readingGoal.currentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-xs text-indigo-200 italic line-clamp-1">
                    "A room without books is like a body without a soul."
                  </p>
                  <button
                    onClick={() => setActiveTab("tracker")}
                    className="text-xs font-semibold text-amber-300 hover:underline shrink-0 ml-2"
                  >
                    Adjust →
                  </button>
                </div>
              </div>
            </div>

            {/* HANDPICKED RECOMMENDATIONS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={20} />
                    Recommended For You
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Curated picks based on trending reader favorites and your reading taste
                  </p>
                </div>
                <Link
                  to="/books"
                  className="text-xs sm:text-sm font-semibold text-[#5951e6] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  View full catalog <ChevronRight size={16} />
                </Link>
              </div>

              {booksLoading ? (
                <div className="py-12 text-center text-slate-400">Loading recommendations...</div>
              ) : recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {recommendedBooks.map((book) => {
                    const isWishlisted = wishlist.some((item) => item._id === book._id);
                    return (
                      <div
                        key={book._id}
                        className="group bg-slate-50/60 hover:bg-white rounded-2xl p-4 border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 mb-3.5">
                            {book.image ? (
                              <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl text-slate-400">
                                📖
                              </div>
                            )}

                            {/* Wishlist button over image */}
                            <button
                              onClick={() => handleToggleWishlist(book)}
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isWishlisted
                                  ? "bg-rose-500 text-white shadow-md"
                                  : "bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500"
                              }`}
                              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            {/* Rating badge */}
                            {book.rating && (
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                {book.rating}
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                            {book.category || "General"}
                          </span>
                          <Link
                            to={`/books/${book._id}`}
                            className="font-bold text-sm text-slate-800 hover:text-[#5951e6] transition-colors line-clamp-1 mt-0.5"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-slate-400 line-clamp-1">{book.author}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs text-slate-400 block leading-tight">Price</span>
                            <span className="font-extrabold text-[#5951e6] text-base">
                              ${book.price}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(book)}
                            className="px-3.5 py-2 rounded-xl bg-[#5951e6] hover:bg-[#4740d4] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <ShoppingCart size={13} />
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">
                  No books currently available to display.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB: ORDERS ======================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header + Search/Filter Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="text-[#5951e6]" size={22} />
                  Order History & Invoices
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Track delivery progress, view invoice receipts, and re-order your favorite books
                </p>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by order ID or book..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-[#5951e6] w-48 sm:w-64 transition-all"
                  />
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setOrderFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("paid")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === "paid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => setOrderFilter("pending")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      orderFilter === "pending"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500"
                    }`}
                  >
                    Pending
                  </button>
                </div>

                <button
                  onClick={fetchOrders}
                  title="Refresh Orders"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {ordersError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
                <span>{ordersError}</span>
                <button
                  onClick={fetchOrders}
                  className="underline font-semibold text-rose-800 text-xs ml-4"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Orders List */}
            {ordersLoading ? (
              <div className="py-20 bg-white rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center gap-3">
                <RefreshCw className="animate-spin text-[#5951e6]" size={32} />
                <p className="text-sm text-slate-500">Loading your purchase history...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isPaid =
                    order.paymentStatus === "PAID" || order.status === "PAID";
                  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <article
                      key={order._id}
                      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${
                              isPaid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {isPaid ? "✓" : "⏳"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                                #{order._id}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(order._id);
                                  toast.success("Order ID copied!");
                                }}
                                title="Copy Order ID"
                                className="text-slate-400 hover:text-slate-700"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Clock size={12} /> {dateStr}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs text-slate-400">Total</span>
                            <p className="text-base sm:text-lg font-extrabold text-[#5951e6]">
                              {order.currency || "NPR"}{" "}
                              {Number(order.totalAmount).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.paymentStatus || order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items table / list */}
                      <div className="mt-4 divide-y divide-slate-100">
                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="py-3 flex items-center justify-between gap-4 text-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                {item.quantity}×
                              </span>
                              <span className="font-semibold text-slate-800 truncate">
                                {item.title}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs text-slate-400 mr-3">
                                {order.currency || "NPR"} {item.price} each
                              </span>
                              <span className="font-bold text-slate-900">
                                {order.currency || "NPR"} {item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          Official Bookstore Guarantee • Secure Delivery
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            to="/books"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                          >
                            Order More Books
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 bg-white rounded-3xl border border-slate-100 text-center">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-[#5951e6] flex items-center justify-center text-2xl mx-auto mb-3">
                  📦
                </div>
                <h3 className="font-bold text-slate-900 text-lg">No orders matching your filter</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                  {orderSearch
                    ? "Try clearing your search term to see other orders."
                    : "You haven't placed any orders yet. Discover your next great book today!"}
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5951e6] text-white text-sm font-semibold hover:bg-[#473dbd] transition-colors"
                >
                  <BookOpen size={16} /> Browse Bookstore
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: WISHLIST ======================= */}
        {activeTab === "wishlist" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="text-rose-500 fill-rose-500" size={22} />
                  Saved Wishlist
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Titles you've saved to read or purchase next ({wishlist.length} items)
                </p>
              </div>

              {wishlist.length > 0 && (
                <button
                  onClick={() => {
                    setWishlist([]);
                    toast.success("Wishlist cleared");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors self-start sm:self-auto"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              )}
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {wishlist.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 mb-3">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300">
                            📖
                          </div>
                        )}
                        <button
                          onClick={() => handleToggleWishlist(book)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                        {book.category || "General"}
                      </span>
                      <Link
                        to={`/books/${book._id}`}
                        className="font-bold text-sm text-slate-900 hover:text-[#5951e6] line-clamp-1 mt-0.5"
                      >
                        {book.title}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-1">{book.author}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-base font-extrabold text-[#5951e6]">
                        ${book.price}
                      </span>
                      <button
                        onClick={() => handleMoveWishlistToCart(book)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingCart size={13} />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 bg-white rounded-3xl border border-slate-100 text-center">
                <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl mx-auto mb-3">
                  <Heart size={28} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Your Wishlist is Empty</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                  Save books you love by tapping the heart icon as you browse our store!
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5951e6] text-white text-sm font-semibold hover:bg-[#473dbd] transition-colors"
                >
                  <BookOpen size={16} /> Explore Bestsellers
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: READING GOALS ======================= */}
        {activeTab === "tracker" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="text-indigo-600" size={22} />
                Personal Reading Tracker & Challenges
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Set annual reading targets, log completed books, and stay inspired
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal Configurator Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Award className="text-amber-500" size={18} />
                    2026 Annual Book Goal
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust your reading target and mark books as completed
                  </p>
                </div>

                {/* Steppers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      Target Books
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() =>
                          setReadingGoal((prev) => ({
                            ...prev,
                            target: Math.max(1, prev.target - 1),
                          }))
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 text-slate-700"
                      >
                        -
                      </button>
                      <span className="text-2xl font-extrabold text-slate-900">
                        {readingGoal.target}
                      </span>
                      <button
                        onClick={() =>
                          setReadingGoal((prev) => ({
                            ...prev,
                            target: prev.target + 1,
                          }))
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      Books Completed
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() =>
                          setReadingGoal((prev) => ({
                            ...prev,
                            completed: Math.max(0, prev.completed - 1),
                          }))
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold hover:bg-slate-100 text-slate-700"
                      >
                        -
                      </button>
                      <span className="text-2xl font-extrabold text-[#5951e6]">
                        {readingGoal.completed}
                      </span>
                      <button
                        onClick={() => {
                          setReadingGoal((prev) => ({
                            ...prev,
                            completed: prev.completed + 1,
                          }));
                          toast.success("Awesome job on finishing another book! 🎉");
                        }}
                        className="w-8 h-8 rounded-lg bg-[#5951e6] text-white font-bold hover:bg-[#4740d4]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/60">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-2">
                    <span>Yearly Progress</span>
                    <span className="text-indigo-600">
                      {Math.round((readingGoal.completed / readingGoal.target) * 100)}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((readingGoal.completed / readingGoal.target) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {readingGoal.target - readingGoal.completed > 0
                      ? `${readingGoal.target - readingGoal.completed} more books to reach your 2026 goal!`
                      : "🎉 Congratulations! You have achieved your annual reading goal!"}
                  </p>
                </div>
              </div>

              {/* Currently Reading & Notes */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <BookOpen className="text-indigo-600" size={18} />
                    Current Read & Bookmark
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Keep tabs on the title you are actively reading
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Book Title</label>
                    <input
                      type="text"
                      value={readingGoal.currentBook}
                      onChange={(e) =>
                        setReadingGoal((prev) => ({ ...prev, currentBook: e.target.value }))
                      }
                      className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Reading Progress</span>
                      <span className="text-[#5951e6]">{readingGoal.currentProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={readingGoal.currentProgress}
                      onChange={(e) =>
                        setReadingGoal((prev) => ({
                          ...prev,
                          currentProgress: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#5951e6]"
                    />
                  </div>
                </div>

                {/* Literary Quote */}
                <div className="bg-amber-50/70 border border-amber-200/50 p-4 rounded-2xl text-xs text-amber-900">
                  <span className="font-bold block mb-1">✨ Reader Wisdom</span>
                  <p className="italic">
                    "Reading is essential for those who seek to rise above the ordinary." – Jim Rohn
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: PROFILE & ADDRESS ======================= */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="text-[#5951e6]" size={22} />
                Profile, Shipping & Preferences
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage your personal contact info, primary delivery destination, and favorite genres
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Form */}
              <form
                onSubmit={handleSaveProfile}
                className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Email Address (Account ID)
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    Default Shipping Address
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Used to pre-fill checkout for faster book deliveries
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Street Address / Landmark
                      </label>
                      <input
                        type="text"
                        value={profileForm.street}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, street: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        City / District
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={profileForm.postalCode}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, postalCode: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5951e6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Favorite Genres Chips */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    Favorite Literary Genres
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    We personalize your recommendations based on what you love
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => {
                      const selected = profileForm.genres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            selected
                              ? "bg-[#5951e6] text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#5951e6] hover:bg-[#4740d4] text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Right 1 Col: Account Security & Session */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    Account Security
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your active authentication session details
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400">Account Role</span>
                    <p className="font-bold text-slate-800 capitalize mt-0.5">
                      {user.role || "Standard Reader"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Security Status</span>
                    <p className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Check size={13} /> JWT Authenticated
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Session Token</span>
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="text-[#5951e6] font-semibold text-[11px] hover:underline"
                      >
                        {showToken ? "Hide" : "Reveal"}
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-slate-500 break-all bg-white p-2 rounded-lg border border-slate-200 mt-1">
                      {showToken
                        ? token
                        : token
                        ? `${token.slice(0, 16)}••••••••••••••••${token.slice(-10)}`
                        : "No active token"}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      {copiedToken ? <Check size={13} /> : <Copy size={13} />}
                      {copiedToken ? "Copied!" : "Copy Token"}
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out of Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: PERKS & SUPPORT ======================= */}
        {activeTab === "support" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-[#5951e6]" size={22} />
                Member Perks, Help & FAQs
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Everything you need to know about your bookstore perks, orders, and reader support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Perks Highlights */}
              <div className="bg-gradient-to-br from-[#5951e6] to-[#736af5] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Exclusive Perks
                </span>
                <h3 className="text-xl font-extrabold">Reader Membership Privileges</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-indigo-100">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span>
                      <strong>Free Delivery</strong> on all book purchases over NPR 1,000 across Nepal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span>
                      <strong>Reader Rewards</strong>: Earn 1 point per NPR 25 spent. Redeem points for discount codes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span>
                      <strong>Pre-order Access</strong>: First dibs on signed editions and new author releases.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span>
                      <strong>Book Replacement Guarantee</strong>: 7-day hassle-free replacement for any damaged prints.
                    </span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs text-indigo-200">
                    Need support? Contact us at:
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    support@bookstore.com
                  </p>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  Frequently Asked Questions
                </h3>

                {[
                  {
                    q: "How does payment work for my orders?",
                    a: "You can pay easily using our integrated payment options including local digital wallets (Khalti, eSewa, Cards). Once paid, your order status immediately turns into PAID in your dashboard.",
                  },
                  {
                    q: "How long does shipping take?",
                    a: "Orders in Kathmandu valley are delivered within 24–48 hours. Outside the valley, standard courier delivery takes 2–4 business days.",
                  },
                  {
                    q: "How do I redeem my reward points?",
                    a: "During checkout, you can apply your accumulated reward points for instant discount coupons on your book cart total.",
                  },
                  {
                    q: "Can I cancel or modify an order?",
                    a: "If your order has not been dispatched yet, you can contact our 24/7 reader support desk to cancel or update your delivery address.",
                  },
                ].map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-slate-50 rounded-2xl p-4 border border-slate-100 open:bg-indigo-50/40 open:border-indigo-100 transition-all"
                  >
                    <summary className="font-semibold text-sm text-slate-800 cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center space-y-4 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto">
              <LogOut size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Sign Out</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Are you sure you want to log out of your bookstore account?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  DashboardSession.logout(navigate);
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors shadow-sm"
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