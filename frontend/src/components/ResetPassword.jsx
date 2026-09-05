import { useState } from "react";
import api from "../utils/API.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "../Layout/Footer/Footer.jsx";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", { email });

      toast.success(res.data.message || "Reset link sent to your email");
      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your registered email to receive a reset link
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center text-gray-700">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
