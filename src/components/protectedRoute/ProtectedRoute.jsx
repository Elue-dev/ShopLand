import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signup" />;
  }

  return children;
}
