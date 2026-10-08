import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

const API_BASE = "https://bookstore-backend-1-nc4r.onrender.com";

class AuthService {
  static parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  static getAuthBody({ isRegister, name, email, password, role }) {
    return isRegister
      ? { name, email, password, role }
      : { email, password, role };
  }

  static saveUserSession(token, payload, fallbackName, email) {
    setAuthToken(token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: payload.id,
        role: payload.role,
        name: payload.name || fallbackName,
        email,
      })
    );
  }
}

class AuthRequestService {
  static async submit({ isRegister, name, email, password, role }) {
    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    const body = AuthService.getAuthBody({ isRegister, name, email, password, role });

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Oops! Something went sideways.");
    }

    return data;
  }
}

function LoginForm() {
  const navigate = useNavigate();

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
    if (!email || !password) { setError("All fields, please."); return; }
    if (isRegister && !name) { setError("Need your name, too."); return; }
    setLoading(true);
    setError("");

    try {
      const data = await AuthRequestService.submit({
        isRegister,
        name,
        email,
        password,
        role,
      });

      const payload = AuthService.parseJwt(data.token);
      if (!payload) {
        throw new Error("Invalid token received.");
      }

      AuthService.saveUserSession(data.token, payload, name, email);

      if (payload.role === "admin") navigate("/admin-dashboard");
      else navigate("/books");
    } catch (err) {
      setError(err.message || "Couldn't reach the server. Try later?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md space-y-4 sm:space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">
          {isRegister ? "Sign up" : "Hey there! Sign in"}
        </h1>

        {isRegister && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-2xl px-4 py-2.5 sm:py-3 text-sm sm:text-base
             outline-none focus:ring-2 focus:ring-indigo-300"
          />
        )}

        <input
          type="email"
          placeholder={isRegister ? "Email address" : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-2xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="password"
          placeholder={isRegister ? "Password" : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-2xl px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole("user")}
            className={`py-2.5 sm:py-3 rounded-2xl border text-sm sm:text-base font-medium transition-colors
              ${role === "user" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            Regular
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`py-2.5 sm:py-3 rounded-2xl border text-sm sm:text-base font-medium transition-colors
              ${role === "admin" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 hover:bg-slate-50"}`}
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
          className={`w-full py-2.5 sm:py-3 rounded-2xl text-white font-semibold text-sm sm:text-base transition-opacity
            ${loading ? "opacity-60 cursor-not-allowed" : "opacity-100"}
            ${isAdmin ? "bg-indigo-500 hover:bg-indigo-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
        >
          {loading ? "One sec..." : isRegister ? "Sign me up" : "Log me in"}
        </button>

        <button
          onClick={() => setTab(isRegister ? "login" : "register")}
          className="text-indigo-500 hover:text-indigo-700 text-sm w-full transition-colors"
        >
          {isRegister ? "Already have an account? Log in" : "Need an account? Join now"}
        </button>
      </div>
    </div>
  );
}

export default LoginForm;