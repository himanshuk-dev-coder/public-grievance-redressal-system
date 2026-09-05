import { createContext, useEffect, useState } from "react";
import api from "../utils/API"; // axios instance with baseURL + credentials
import { useNavigate } from "react-router-dom";

export const WebData = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        console.log("response :- ",res);
        setUser(res.data.user);
      } catch (err) {
        console.log(err.message);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      // Backend logout (clears cookies)
      await api.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout API failed:", error.message);
    } finally {
      // ✅ ALWAYS clear auth state
      setUser(null);

      // ✅ Redirect immediately
      navigate("/auth", { replace: true });
    }
  };

  return (
    <WebData.Provider value={{ user, setUser, logout }}>
      {children}
    </WebData.Provider>
  );
};

export default UserContext;
