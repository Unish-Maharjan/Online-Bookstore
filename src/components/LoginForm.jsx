import { useState } from "react";
import Dashboard from "./Dashboard";

const API_BASE = "https://bookstore-backend-1-nc4r.onrender.com";

// decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function LoginForm() {

  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const isRegister = tab === "register";
  const isAdmin = role === "admin";


  const handleSubmit = async () => {

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (isRegister && !name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
        
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const body = isRegister
        ? {
            name,
            email,
            password,
            role,
          }
        : {
            email,
            password,
            role,
          };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      const payload = parseJwt(data.token);

      setSession({
        token: data.token,
        user: {
          id: payload.id,
          role: payload.role,
          name: payload.name || name,
          email,
        },
      });

    } catch (error) {

      setError("Server error. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  // Logout
  const handleLogout = () => {
    setSession(null);
    setEmail("");
    setPassword("");
    setName("");
    setRole("user");
    setTab("login");
  };

  // After Login
  if (session) {
    return (
      <Dashboard
        user={session.user}
        token={session.token}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-5">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        {/* Name */}
        {isRegister && (
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3 outline-none"
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-2xl px-4 py-3 outline-none"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-2xl px-4 py-3 outline-none"
        />

        {/* Role */}
        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() => setRole("user")}
            className={`py-3 rounded-2xl border
              ${
                role === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-white"
              }`}
          >
            User
          </button>

          <button
            onClick={() => setRole("admin")}
            className={`py-3 rounded-2xl border
              ${
                role === "admin"
                  ? "bg-indigo-500 text-white"
                  : "bg-white"
              }`}
          >
            Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-2xl text-white font-semibold
            ${
              isAdmin
                ? "bg-indigo-500"
                : "bg-emerald-500"
            }`}
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create Account"
            : "Sign In"}
        </button>

        {/* Switch */}
        <button
          onClick={() =>
            setTab(isRegister ? "login" : "register")
          }
          className="text-indigo-500 text-sm w-full"
        >
          {isRegister
            ? "Already have an account?"
            : "Create new account"}
        </button>
      </div>
    </div>
  );
}

export default LoginForm;