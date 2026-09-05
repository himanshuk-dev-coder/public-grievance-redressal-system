import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/API.js";
import { toast } from "react-toastify";
import "./ResetPasswordToken.css"; // Import the CSS file

const ResetPasswordToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post(`/auth/reset-password/${token}`, {
        newPassword: password,
        confirmPassword,
      });

      toast.success(res.data.message || "Password reset successful");
      navigate("/auth");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Create New Password</h2>
        <p className="reset-subtitle">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="reset-input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="reset-input"
          />

          <button type="submit" disabled={loading} className="reset-button">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordToken;
