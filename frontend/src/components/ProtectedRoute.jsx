import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth_token");

  // Backend integration point:
  // Replace localStorage mock check with real token/session validation.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
