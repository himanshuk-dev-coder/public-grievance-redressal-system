import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { WebData } from "../../context/UserContext.jsx";

const CitizenNavbar = () => {
  const { user, logout } = useContext(WebData);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="bg-[#1f3c88] px-12 py-4 flex justify-between items-center text-white">
      {/* Logo */}
      <Link
        to="/"
        className="border border-blue-300 rounded-full px-5 py-1
          text-2xl   text-white hover:bg-blue-600 transition"
      >
        PGRS
      </Link>

      <div className="flex gap-6">
        <Link to="/citizen/dashboard">Dashboard</Link>
        <Link to="/raise-complaint">Raise Complaint</Link>
        <Link to="/track-complaint">Track Complaint</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
          CITIZEN
        </span>
        <button
          className="border border-blue-300 rounded-full px-5 py-1
            text-white hover:bg-blue-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default CitizenNavbar;
