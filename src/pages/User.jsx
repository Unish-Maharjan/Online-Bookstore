import { useState } from "react";

const API_BASE = "https://bookstore-backend-1-nc4r.onrender.com";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ user, token, onLogout }) {
  const { role, name, email } = user;
  const isAdmin = role === "admin";

  const privileges = isAdmin
    ? ["Manage books & inventory", "View all orders", "Manage users", "Site settings"]
    : ["Browse books", "Place orders", "View order history", "Manage profile"];

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center space-y-6">

        {/* Avatar */}
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-3xl font-bold
            ${isAdmin ? "bg-indigo-500" : "bg-emerald-500"}`}
        >
          {(name || email || "?")[0].toUpperCase()}
        </div>

        {/* User info */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{name || "Welcome"}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
              ${isAdmin ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}
          >
            {role}
          </span>
        </div>

        {/* JWT token preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Session Token (JWT)
          </p>
          <p className="font-mono text-xs text-slate-500 break-all leading-relaxed">
            {token.slice(0, 80)}…
          </p>
        </div>

        {/* Privileges */}
        <div
          className={`border rounded-2xl p-4 text-left space-y-2
            ${isAdmin ? "bg-indigo-50 border-indigo-100" : "bg-emerald-50 border-emerald-100"}`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-wider
              ${isAdmin ? "text-indigo-400" : "text-emerald-400"}`}
          >
            {isAdmin ? "Admin Privileges" : "User Privileges"}
          </p>
          {privileges.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <span className={isAdmin ? "text-indigo-400" : "text-emerald-400"}>✓</span>
              {item}
            </div>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}


export default function LoginForm() {
  const [tab, setTab]               = useState("login");    
  const [role, setRole]             = useState("user");      
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [session, setSession]       = useState(null);       

  const isRegister = tab === "register";
  const isAdmin    = role === "admin";

  const switchTab = (t) => {
    setTab(t);
    setError("");
  };

  // ── Submit (login or register) ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (isRegister && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { name: name.trim(), email: email.trim(), password, role }
        : { email: email.trim(), password, role };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? `${isRegister ? "Registration" : "Login"} failed. Please try again.`);
        setLoading(false);
        return;
      }

      const payload = parseJwt(data.token);
      if (!payload) {
        setError("Received an invalid token from the server.");
        setLoading(false);
        return;
      }

      setSession({
        token: data.token,
        user: {
          id:    payload.id,
          role:  data.user?.role ?? payload.role ?? role,
          name:  data.user?.name  ?? name.trim(),
          email: data.user?.email ?? email.trim(),
        },
      });
    } catch {
      setError(`Cannot reach the server at ${API_BASE}. Make sure your backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setTab("login");
    setRole("user");
  };

  
  if (session) {
    return <Dashboard user={session.user} token={session.token} onLogout={handleLogout} />;
  }

  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center p-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-5">

        {/* Logo / header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-lg font-bold">
            B
          </div>
          <span className="text-lg font-bold text-slate-800">Bookstore</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${tab === t
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"}`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

      
        {isRegister && (
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
            <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Jane Smith"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
              />
            </div>
          </div>
        )}

      
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Email Address</label>
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3
            focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>
        </div>

       
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3
            focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="18" height="11" x="3" y="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

     
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Account Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "user",  label: "User",  desc: "Browse & order" },
              { value: "admin", label: "Admin", desc: "Full access" },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all duration-200 text-center
                  ${role === value
                    ? value === "admin"
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
              >
                <span className="text-xl">
                  {value === "admin" ? "🛡️" : "👤"}
                </span>
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs opacity-70">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base shadow-md transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2
            ${isAdmin
              ? "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"}`}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {isRegister ? "Creating account…" : "Signing in…"}
            </>
          ) : isRegister ? "Create Account" : "Sign In"}
        </button>

        {/* Switch tab link */}
        <div className="text-center">
          <button
            onClick={() => switchTab(isRegister ? "login" : "register")}
            className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}