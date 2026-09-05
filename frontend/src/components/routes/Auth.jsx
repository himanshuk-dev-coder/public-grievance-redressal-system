import { useContext, useState } from "react";
import Footer from "../../Layout/Footer/Footer.jsx";
import { useForm } from "react-hook-form";
import { WebData } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import api from "../../utils/API.js";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { setUser } = useContext(WebData);
  const [role, setRole] = useState("citizen");
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const formHandler = async (formData) => {

    console.log("formData:", formData);

    // ✅ Validate form
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Email aur Password required");
        return;
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.role
      ) {
        toast.error("All fields are required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      // ✅ Prepare payload
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
          };

      // ✅ Login / Signup
      const authRes = await api.post(
        isLogin ? "/auth/login" : "/auth/signup",
        payload,
      );

      // 👉 SIGNUP CASE
      if (!isLogin) {
        console.log("authRes.data :- ", authRes.data);
        if (authRes?.data) {
          toast.success("Signup successful 🎉");
        } else {
          toast.error("Signup failed");
        }

        setIsLogin(true);
        reset();
        return;
      }

      if (!authRes?.data) {
        toast.error("Login/Signup failed");
        return;
      }

      // ✅ Fetch user profile (after successful login)
      const profileRes = await api.get("/auth/profile", {
        withCredentials: true,
      });

      if (!profileRes?.data?.user) {
        toast.error("Unable to fetch user profile");
        return;
      }

      // ✅ Set user
      setUser(profileRes.data.user);

      // ✅ Role-based redirect
      const userRole = profileRes.data.user.role;
      console.log(`userRole :- ${userRole}`);
      if (userRole === "admin") navigate("/admin");
      else if (userRole === "officer") navigate("/officer");
      else navigate("/profile");

      // ✅ Reset form
      reset();
    } catch (error) {
      console.log("STATUS 👉", error.response?.status);
      console.log("MESSAGE 👉", error.response?.data);

      console.error("Auth Error:", error);

      let message = "Something went wrong";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      toast.error(`Auth ERROR :- ${message}`);
    }
  };

  

  return (
    <div className="flex-col-min">
      <div className="flex-1 flex justify-center items-center bg-gray-100 px-4 py-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 mt-5 mb-5">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {isLogin
              ? "Welcome back! Please login to continue."
              : "Create your account to get started."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(formHandler)} className="space-y-5">
            {/* Full Name only for SignUp */}
            {!isLogin && (
              <div>
                {/* 🔐 Role Selection (Login only) */}

                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="role"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Select Your Role
                  </label>{" "}
                  <br />
                  <select
                    id="role"
                    name="role"
                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
                    {...register("role", {
                      required: "Role is required",
                      validate: (value) =>
                        value !== "" || "Please select a role",
                    })}
                  >
                    <option value="">--Select--</option>
                    <option value="citizen">Citizen</option>
                    {/* <option value="admin">Admin</option> */}
                  </select>
                </div>

                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your full name"
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
                required
              />
            </div>

            {/* Confirm Password only for SignUp */}
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-800"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-full font-medium"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Toggle Login / SignUp */}
          {/* Forgot Password (LOGIN ONLY) */}
          {isLogin && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password ?
              </button>
            </div>
          )}

          {/* OR + Google Login (LOGIN ONLY) */}
          {isLogin && (
            <>
              <div className="flex items-center my-6">
                <div className="grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">OR</span>
                <div className="grow border-t border-gray-300"></div>
              </div>

              {/* <button
                type="button"
                onClick={() => navigate('http://localhost:5000/api/auth/google')}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                <FcGoogle size={22} />
                <span className="font-medium text-gray-700">
                  Continue with Google
                </span>
              </button> */}
            </>
          )}

          {/* Toggle Login / SignUp */}
          <div className="mt-6 text-center text-gray-700">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:underline font-medium"
                  onClick={() => {
                    setIsLogin(false);
                    reset();
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:underline font-medium"
                  onClick={() => {
                    setIsLogin(true);
                    reset();
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
