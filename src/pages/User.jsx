import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://bookstore-backend-1-nc4r.onrender.com";

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

  // If already logged in, redirect immediately
  const existingToken = localStorage.getItem("token");
  if (existingToken) {
    const payload = parseJwt(existingToken);
    if (payload) {
      if (payload.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
      return null;
    }
  }

  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { name, email, password, role }
        : { email, password, role };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      const payload = parseJwt(data.token);

      if (!payload) {
        setError("Invalid token received.");
        setLoading(false);
        return;
      }

      // Save token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: payload.id,
        role: payload.role,
        name: payload.name || name,
        email,
      }));

      if (payload.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-5">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        {isRegister && (
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3 outline-none"
          />
        )}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-2xl px-4 py-3 outline-none"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-2xl px-4 py-3 outline-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole("user")}
            className={`py-3 rounded-2xl border ${
              role === "user" ? "bg-emerald-500 text-white" : "bg-white"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`py-3 rounded-2xl border ${
              role === "admin" ? "bg-indigo-500 text-white" : "bg-white"
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-2xl text-white font-semibold ${
            isAdmin ? "bg-indigo-500" : "bg-emerald-500"
          }`}
        >
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
        </button>

        <button onClick={() => setTab(isRegister ? "login" : "register")}
          className="text-indigo-500 text-sm w-full">
          {isRegister ? "Already have an account?" : "Create new account"}
        </button>

      </div>
    </div>
  );
}

export default User;