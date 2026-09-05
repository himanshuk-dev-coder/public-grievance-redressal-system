import { useEffect, useState, useContext } from "react";
import api from "../utils/API.js";
import Footer from "./../Layout/Footer/Footer.jsx";
import { WebData } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logout } = useContext(WebData) || {};
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          withCredentials: true,
        });

        if (!mounted) return;
        console.log("res.data", res.data);
        if (res?.data?.user) {
          setUser(res.data.user);
        } else {
          navigate("/auth", { replace: true });
        }
      } catch (err) {
        console.error("Profile error:", err);
        navigate("/auth", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => (mounted = false);
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // prevent render loop

  return (
    <div>
      <div className="bg-gray-100 py-16 px-4 min-h-[calc(100vh-160px)]">
        {/* Profile Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-400 text-white flex items-center justify-center text-5xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t"></div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-xl text-gray-500">User ID</p>
              <p className="font-semibold">{user.id}</p>
            </div>

            <div>
              <p className="text-xl text-gray-500">Account Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>

            <div>
              <p className="text-xl text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-xl text-gray-500">Role</p>
              {user.role && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                    {
                      citizen: "bg-green-600 text-white",
                      officer: "bg-blue-600 text-white",
                      admin: "bg-red-600 text-white",
                    }[user.role]
                  }`}
                >
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex gap-4">
            <button onClick={() => navigate("/change-password")}
            className="px-6 py-2 rounded-full bg-indigo-900 text-white hover:bg-blue-800 transition">
              Change Password
            </button>
            <button onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition">
              Edit Profile
            </button>

            <button onClick={() => navigate("/verify-email")}
            className="px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-700 transition">
              Verify Email
            </button>

            <button
              onClick={logout}
              className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
