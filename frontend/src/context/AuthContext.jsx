import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/profile", { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      // Try refreshing token if 401
      try {
        const refreshRes = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        const res2 = await axios.get("/api/auth/profile", { withCredentials: true });
        setUser(res2.data.user);
      } catch (refreshErr) {
        setUser(null);
      }
    }
  };
  fetchUser();
}, []);


  const logout = async () => {
    try {
      // Hit backend logout route
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clear frontend state
      setUser(null);
      localStorage.removeItem("token"); // agar token localStorage me store hai

      // Redirect to login page
      window.location.href = "/auth";
      alert("You have been logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed! Try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
