import { Navigate } from "react-router-dom";

class AuthGuard {
  static parseJwt(token) {
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  static getCurrentUser() {
    const token = localStorage.getItem("token");
    return this.parseJwt(token);
  }

  static isAdmin() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === "admin");
  }
}

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/user" />;
  }

  const user = AuthGuard.parseJwt(token);
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}