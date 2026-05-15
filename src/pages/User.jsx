import { useState } from "react";


const API_BASE = "https://bookstore-backend-1-nc4r.onrender.com";


function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}


function Dashboard({ user, token, onLogout }) {
  const { role, name, email } = user;
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center space-y-6">

        {/* Avatar */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-3xl font-bold
          ${isAdmin ? "bg-indigo-500" : "bg-emerald-500"}`}>
          {name?.[0]?.toUpperCase() ?? (isAdmin ? "A" : "U")}
        </div>

        {/* User info */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{name ?? "Welcome"}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{email}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
            ${isAdmin ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}>
            {role}
          </span>
        </div>

        {/* JWT token preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Session Token (JWT)</p>
          <p className="font-mono text-xs text-slate-500 break-all leading-relaxed">
            {token.slice(0, 64)}
          </p>
        </div>

        {/* Privileges */}
        <div className={`border rounded-2xl p-4 text-left space-y-2
          ${isAdmin ? "bg-indigo-50 border-indigo-100" : "bg-emerald-50 border-emerald-100"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider
            ${isAdmin ? "text-indigo-400" : "text-emerald-400"}`}>
            {isAdmin ? "Admin Privileges" : "User Privileges"}
          </p>
          {(isAdmin
            ? ["Manage books & inventory", "View all orders", "Manage users", "Site settings"]
            : ["Browse books", "Place orders", "View order history", "Manage profile"]
          ).map((item) => (
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

//Login Form 
export default function LoginForm() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [session, setSession]           = useState(null); // { token, user }

  // ── Call POST /auth/login ──────────────────────────────────────────────────
  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Decode JWT to get role & id (server already verified the password)
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
          role:  payload.role,
          name:  data.user?.name  ?? null,
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
    setEmail("");
    setPassword("");
    setError("");
  };

  if (session) {
    return <Dashboard user={session.user} token={session.token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your bookstore account</p>
        </div>

        {/* API hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-700 space-y-1">
          <p className="font-semibold">Connects to</p>
          <p className="font-mono">{API_BASE}/auth/login</p>
          <p className="text-amber-500">Change <code className="font-mono">API_BASE</code> at the top of this file if needed.</p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Email Address</label>
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3
            focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3
            focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98]
            text-white font-bold text-base shadow-md shadow-indigo-200 transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Signing in…
            </>
          ) : "Sign In"}
        </button>

        {/* Back to Home */}
        <div className="text-center">
          <button className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
