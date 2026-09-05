import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/API";
import { toast } from "react-toastify";
import Footer from "../Layout/Footer/Footer.jsx";
import "./verifyEmail.css";

const VerifyEmail = () => {
  const { token: urlToken } = useParams(); // token from URL
  const navigate = useNavigate();
  const hasCalledVerify = useRef(false);
  const timeoutRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(""); // for resend verification
  const [inputToken, setInputToken] = useState(""); // manual 8-digit code

  // 🔁 1. Auto verify email on mount
  useEffect(() => {
    if (!urlToken || hasCalledVerify.current) {
      setLoading(false);
      return;
    }

    hasCalledVerify.current = true;

    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${urlToken}`);
        toast.success(res.data.message || "Email verified successfully");

        // Redirect after short delay
        timeoutRef.current = setTimeout(() => navigate("/profile"), 1500);
      } catch (err) {
        const msg = err.response?.data?.message;

        if (msg === "Email already verified") {
          toast.info("Email already verified. Please login.");
          timeoutRef.current = setTimeout(() => navigate("/profile"), 1500);
        } else {
          toast.error(msg || "Invalid or expired verification link");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();

    // cleanup timeout on unmount
    return () => clearTimeout(timeoutRef.current);
  }, [urlToken]);

  // 🔁 2. Resend verification link
  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email to resend verification link");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/resend-verification-link", { email });
      toast.success(res.data.message || "Verification link sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend verification link");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 3. Manual code verification
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!inputToken) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/auth/verify-email/${inputToken}`);
      toast.success(res.data.message || "Email verified successfully");

      timeoutRef.current = setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Processing...</p>;

  return (
    <>
      <h1 className="logInStatus">Verify Your Email</h1>

      <div className="container">
        {/* 🔁 Resend verification */}
        <div className="resend-verifyContainer">
          <form onSubmit={handleResend}>
            <p>
              Email: <span>{email}</span>
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p>
              Your Email has not been verified yet. Please verify your email by
              entering the 8-Digit Code or request a new verification link
            </p>
            <button className="resend-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Resend Verification Link"}
            </button>
          </form>
        </div>

        {/* ✅ Manual code verification */}
        <div className="verify-codeContainer">
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              placeholder="Enter 8-Digit Verification Code"
              value={inputToken}
              maxLength={8}
              onChange={(e) => setInputToken(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VerifyEmail;
