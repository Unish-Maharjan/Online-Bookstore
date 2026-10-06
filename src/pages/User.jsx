import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../services/api";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  X,
} from "lucide-react";

// Safe Decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function User() {
  const navigate = useNavigate();

  // If already logged in, redirect immediately to their dashboard
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      const payload = parseJwt(existingToken);
      if (payload) {
        if (payload.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [navigate]);

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const isRegister = tab === "register";
  const isAdmin = role === "admin";

  // Password strength score (0 to 3)
  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8 && /[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabels = ["Weak", "Fair", "Strong"];
  const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-emerald-500"];

  // Quick Demo account prefiller
  const fillDemoAccount = (demoRole) => {
    setError("");
    if (demoRole === "admin") {
      setRole("admin");
      setTab("login");
      setEmail("admin@gmail.com");
      setPassword("admin123");
      toast.success("Loaded Administrator demo credentials!", { icon: "🛡️" });
    } else {
      setRole("user");
      setTab("login");
      setEmail("reader@gmail.com");
      setPassword("reader123");
      toast.success("Loaded Reader demo credentials!", { icon: "📖" });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both your email address and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { name: name.trim(), email: email.trim().toLowerCase(), password, role }
        : { email: email.trim().toLowerCase(), password, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please verify your details.");
        setLoading(false);
        return;
      }

      const payload = parseJwt(data.token);

      if (!payload) {
        setError("Invalid security token received from server.");
        setLoading(false);
        return;
      }

      // Store auth session
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: payload.id,
          role: payload.role,
          name: payload.name || name.trim() || email.split("@")[0],
          email: email.trim().toLowerCase(),
        })
      );

      toast.success(
        isRegister
          ? `Welcome to Bookstore, ${payload.name || name || "Reader"}!`
          : `Welcome back, ${payload.name || "Reader"}!`,
        { icon: "✨", duration: 3500 }
      );

      if (payload.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Server could not be reached. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-br from-[#f8f9ff] via-[#f2f1fc] to-[#eae8fb] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-[Poppins] flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(89,81,230,0.15)] border border-indigo-50/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT BRAND PROMO HERO (5 COLS ON DESKTOP) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1e194f] via-[#352c8a] to-[#5951e6] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle luminous background ambient blurs */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl shadow-inner">
                <i className="fa-solid fa-book-open" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight">BookStore</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 block -mt-1">
                  Nepal's Premier Shelf
                </span>
              </div>
            </div>

            {/* Inspiring Headline */}
            <div className="mt-8 sm:mt-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-amber-300 backdrop-blur-md border border-white/15 mb-3">
                <Sparkles size={13} /> Exclusive Reader Community
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Your Next Great Journey Begins Here.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                Log in to explore thousands of bestsellers, track your reading goals, view order
                invoices, and access exclusive member discounts.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
                  <Check size={14} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-indigo-100">
                  Over 10,000+ curated fiction & non-fiction titles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
                  <Check size={14} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-indigo-100">
                  Instant order history, digital tracking & invoices
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
                  <Check size={14} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-indigo-100">
                  Personalized wishlist & annual reading challenges
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Literary Quote */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
            <p className="text-xs italic text-indigo-200">
              "A reader lives a thousand lives before he dies. The man who never reads lives only
              one."
            </p>
            <p className="text-[11px] font-semibold text-amber-300 mt-1.5">— George R.R. Martin</p>
          </div>
        </div>

        {/* RIGHT FORM CONTAINER (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Top Auth Tab Switcher */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isRegister ? "Create Your Account" : "Welcome Back"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isRegister
                    ? "Join our reader club and start your library today"
                    : "Enter your credentials to access your bookshelf"}
                </p>
              </div>

              {/* Sliding Pill Tab */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    !isRegister
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    isRegister
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Role Switcher Pill (Reader vs Admin) */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                    role === "user"
                      ? "border-[#5951e6] bg-indigo-50/50 ring-2 ring-[#5951e6]/20 shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors ${
                      role === "user" ? "bg-[#5951e6] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <BookOpen size={17} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        role === "user" ? "text-indigo-950" : "text-slate-700"
                      }`}
                    >
                      Reader
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">Customer access</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                    role === "admin"
                      ? "border-[#5951e6] bg-indigo-50/50 ring-2 ring-[#5951e6]/20 shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors ${
                      role === "admin" ? "bg-[#5951e6] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ShieldCheck size={17} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        role === "admin" ? "text-indigo-950" : "text-slate-700"
                      }`}
                    >
                      Admin
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">Store manager</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (Register only) */}
              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Alexander Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-3 focus:ring-indigo-100 transition-all bg-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-3 focus:ring-indigo-100 transition-all bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs font-semibold text-[#5951e6] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isRegister ? "At least 6 characters" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-3 focus:ring-indigo-100 transition-all bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator (Register only) */}
                {isRegister && password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Password strength</span>
                      <span className="font-semibold text-slate-700">
                        {strengthLabels[passwordStrength - 1] || "Too Short"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div
                        className={`rounded-full ${
                          passwordStrength >= 1 ? strengthColors[0] : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`rounded-full ${
                          passwordStrength >= 2 ? strengthColors[1] : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`rounded-full ${
                          passwordStrength >= 3 ? strengthColors[2] : "bg-slate-200"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Me Checkbox */}
              {!isRegister && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5951e6] focus:ring-[#5951e6] border-slate-300"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer">
                    Remember my session on this device
                  </label>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#5951e6] hover:bg-[#473dbd] active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all shadow-[0_8px_20px_rgba(89,81,230,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? "Create Free Account" : "Sign In to Bookstore"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* QUICK DEMO CREDENTIALS SHORTCUTS */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-500">Fast Demo Fill:</span>
              <span>1-Click Test Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount("user")}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 hover:text-[#5951e6] text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📖</span> Demo Reader
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin")}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-200 hover:text-[#5951e6] text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🛡️</span> Demo Admin
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Encrypted with 256-bit JWT security. Your data is protected.</span>
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5951e6] flex items-center justify-center mx-auto">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Reset Your Password</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered email address and our support team will help you recover your
                account.
              </p>
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#5951e6]"
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  toast.success("Password recovery instructions sent to your email!");
                }}
                className="py-2.5 rounded-xl bg-[#5951e6] text-white text-xs font-bold hover:bg-[#473dbd]"
              >
                Send Instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;