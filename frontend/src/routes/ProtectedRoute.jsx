import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { WebData } from "../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  console.log("useContext(WebData) :- ", useContext(WebData));
  const { user, loading } = useContext(WebData);
  // const [role, setRole] = useState('');
  
  console.log("ProtectedRoute user:", user);
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  
  
  if (loading) {
    return <div>Loading...</div>;
  }
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Otherwise, render the protected children
  return children;
};

export default ProtectedRoute;

