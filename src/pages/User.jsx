import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL, getAuthToken, setAuthToken } from "../services/api";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
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

export default function User() {
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect immediately
  useEffect(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      const payload = parseJwt(existingToken);
      if (payload) {
        if (payload.role === "admin") {
          navigate("/admin-dashboard");
        } else if (location.state?.from) {
          navigate(location.state.from);
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [navigate, location.state]);

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const isRegister = tab === "register";

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { name: name.trim(), email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const payload = parseJwt(data.token);

      if (!payload) {
        setError("Invalid response received from server.");
        setLoading(false);
        return;
      }

      // Store auth session in cookies
      setAuthToken(data.token);
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
        isRegister ? "Account created successfully!" : "Signed in successfully."
      );

      if (payload.role === "admin") {
        navigate("/admin-dashboard");
      } else if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
      setForgotEmail("");
      toast.success("Password reset instructions sent to your email.");
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#5951e6] flex items-center justify-center mx-auto mb-3">
            <BookOpen size={22} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isRegister ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isRegister
              ? "Sign up to track your orders and save your favorites"
              : "Sign in with your email and password"}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              !isRegister
                ? "border-[#5951e6] text-[#5951e6]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("register")}
            className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              isRegister
                ? "border-[#5951e6] text-[#5951e6]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Redirect Notice */}
        {location.state?.from && !error && (
          <div className="mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[#5951e6] text-xs sm:text-sm flex items-center gap-2">
            <BookOpen size={16} className="shrink-0 text-[#5951e6]" />
            <span className="leading-snug font-medium">Please sign in to add items to your cart.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (Register only) */}
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-2 focus:ring-indigo-100 transition bg-white"
                  required
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-2 focus:ring-indigo-100 transition bg-white"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-medium text-[#5951e6] hover:underline cursor-pointer"
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
                placeholder={isRegister ? "Minimum 6 characters" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#5951e6] focus:ring-2 focus:ring-indigo-100 transition bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me (Login only) */}
          {!isRegister && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#5951e6] focus:ring-[#5951e6] border-slate-300 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer select-none">
                Remember me on this device
              </label>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#5951e6] hover:bg-[#473dbd] text-white font-semibold text-sm transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isRegister ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Bottom toggle prompt */}
        <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="text-[#5951e6] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className="text-[#5951e6] font-semibold hover:underline cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(false);
                setForgotSent(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#5951e6]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="flex-1 py-2 rounded-xl bg-[#5951e6] text-white text-xs font-semibold hover:bg-[#473dbd] disabled:opacity-60 cursor-pointer"
                >
                  {forgotSent ? "Sending..." : "Send Instructions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}