import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WebData } from "../../context/UserContext";

const AdminNavbar = () => {
  const { user, logout } = useContext(WebData);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  return (
    <nav className="bg-[#1f3c88] px-12 py-4 flex items-center justify-between  text-white">
      <Link
        to="/"
        className="border border-blue-300 rounded-full px-5 py-1
          text-2xl   text-white hover:bg-blue-600 transition"
      >
        PGRS
      </Link>
      <div className="flex gap-6">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/manage-officers">Officers</Link>
        <Link to="/admin/complaints">Complaints</Link>
        <Link to="/admin/contacts">Contacts & Support</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin/ministries">🏛 Ministries & Departments</Link>

      </div>
        <div className="flex items-center gap-4">
          <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
            ADMIN
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

export default AdminNavbar;
