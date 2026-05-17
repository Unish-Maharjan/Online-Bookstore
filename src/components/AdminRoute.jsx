import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/user" />;
  }
  const user = parseJwt(token);
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}