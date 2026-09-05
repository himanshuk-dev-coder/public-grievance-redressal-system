import { useState, useEffect, useContext } from "react";
import api from "../utils/API.js";
import { WebData } from "../context/UserContext.jsx";
import "./EditProfile.css"; // Import the CSS file

import Footer from "../Layout/Footer/Footer.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, setUser } = useContext(WebData);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/edit-profile`, form);
      // ✅ FIX: user ka structure preserve rakho
      setUser((prev) => ({
        ...prev,
        user: res.data.user,
      }));
      toast.success("Profile updated successfully!");
      // ✅ REDIRECT TO PROFILE PAGE
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="edit-profile-container">
        <h1>Edit Your Profile</h1>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
          />

          <button type="submit" className="update-btn">
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
