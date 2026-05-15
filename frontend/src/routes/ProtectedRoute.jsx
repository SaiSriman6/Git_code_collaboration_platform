import { Navigate } from "react-router";
import { useAuth } from "../store/useAuth";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;