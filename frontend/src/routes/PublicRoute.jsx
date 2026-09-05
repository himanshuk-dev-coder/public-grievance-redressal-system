import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { WebData } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(WebData);

  if (loading) return null; // or loader

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default PublicRoute;
