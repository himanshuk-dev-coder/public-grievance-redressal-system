import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constants.js";
import { getHtmlfromMjmlTemplate } from "../lib/getHtmlFromMjml.js";
import { sendEmail } from "../lib/send-email.js";
import {
  getUserByEmail,
  comparePassword,
  hashPassword,
  findUserById,
  insertUser,
  authenticateUser,
  refreshTokens,
  clearUserSession,
  countUserByRole,
  sendNewVerifyEmailLink,
  clearVerifyEmailTokens,
  createVerifyEmailLink,
  insertVerifyEmailToken,
  updateUserByName,
  generateRandomToken,
  findVerificationEmailToken,
  verifyUserEmailAndUpdate,
  clearResetPasswordToken,
  updateUserPassword,
  getResetPasswordToken,
  createResetPasswordLink,
  getUserWithOAuthId,
  linkUserWithOAuth,
  createUserWithOAuth,
} from "./auth.service.js";
import { google } from "../lib/oauth/google.js";

/* ================= LOGIN ================= */

export const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ YAHAN DAALO validation
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Only Gmail or Outlook allowed",
      });
    }

    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Stored hash:", user.password);
    console.log("Entered password:", password);
    const isPasswordValid = await comparePassword(password, user.password);
    console.log("Match result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // We will Implement Hybrid Authentication (Session + JWT).
    await authenticateUser({ req, res, user });
    // ✅ Normal login needs JSON response
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user._id?.toString(),
        name: user.name ?? name,
        email: user.email ?? email,
        role: user.role ?? role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ================= REGISTER ================= */

export const registerUser = async (req, res) => {
  console.log("REGISTER CONTROLLER HIT");

  try {
    console.log("req.body :- ", req.body);
    // console.log("ROLE RECEIVED:", req.body.role);
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ YAHAN DAALO validation
    if (!email.endsWith("@gmail.com" || "@outlook.com")) {
      return res.status(400).json({ message: "Only Gmail allowed" });
    }


    if (!role)
      res.status(400).json({ success: false, message: "Role Not Found" });

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Checking if the User's Entered Email Already Exists or Not in the Database
    const userExists = await getUserByEmail(email);

    // Accessible Later used while inserting & creating Session
    let user;

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Normalize role
    const normalizedRole = role.toLowerCase();

    // RBAC logic
    // Check if role is admin/officer
    if (["admin", "officer"].includes(normalizedRole)) {
      if (normalizedRole === "admin") {
        const existingAdmins = await countUserByRole({ role: "admin" });
        // Allow if no admin exists (first-time setup)
        if (existingAdmins === 0) {
          console.log(
            "No admin / officer exists yet. First admin/officer can be created.",
          );
        } else {
          // Otherwise, only logged-in admin can create
          if (!req.user || req.user.role?.toLowerCase() !== "admin") {
            return res.status(403).json({
              success: false,
              message: `Role not allowed for this request: ${role}`,
            });
          }
        }
      }
      if (normalizedRole === "officer") {
        // Check if any officer exists
        const existingOfficers = await countUserByRole({ role: "officer" });
        if (existingOfficers === 0) {
          console.log("No officer exists yet. First officer can be created.");
        } else {
          // Only logged-in admin can create
          if (!req.user || req.user.role?.toLowerCase() !== "admin") {
            return res.status(403).json({
              success: false,
              message: `Role not allowed for this request: ${role}`,
            });
          }
        }
      }
    }

    // Ensure role is valid
    if (!["citizen", "officer", "admin"].includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const hashedPassword = await hashPassword(password);

    user = await insertUser({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });

    // console.log(user); //  {id}
    // We were getting the Reference ERROR while accessing this user

    // Automatic LogIn After Registration
    let response = await authenticateUser({
      req,
      res,
      user,
      role: normalizedRole,
      name,
      email,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const { newAccessToken, newRefreshToken, user } =
      await refreshTokens(refreshToken);

    const baseConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.cookie("access_token", newAccessToken, {
      ...baseConfig,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", newRefreshToken, {
      ...baseConfig,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};

/* ================= PROFILE ================= */

export const profilePage = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "You are Not Logged In. Please LogIn First to Access this Page",
    });
  }

  let user; // ✅ declare outside
  try {
    user = await findUserById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
  } catch (error) {
    console.log("User Fetch ERROR :- ", error.message);
  }

  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // isEmailValid: user.isEmailValid,
      // hasPassword: Boolean(user.password),  // Related to OAuth Login
      // avatarURL: user.avatarURL,  // User Profile Image for OAuth Login
      // createdAt: user.createdAt,
      // totalClicks,
      // totalCounts: userShortLinks.totalCounts,
      // lastActive: userShortLinks.lastActive
    },
  });
};

/* ================= LOGOUT ================= */

export const logOutUser = async (req, res) => {
  try {
    // req.user = Promise
    const user = await req.user;
    // When user LogOut, then we clear their Created Sessions

    if (user?.sessionId) {
      await clearUserSession(user.sessionId);
    }
    // console.log("req.user.sessionId :- ",user.sessionId);

    // Same config as when creating cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // IMPORTANT
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);

    // Respond with JSON (frontend will handle redirect)
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({ success: false, message: "Logout Failed" });
  }
};

export const EditProfile = async (req, res) => {
  try {
    // req.user comes from auth middleware (JWT / session)
    const userId = req.user.id;

    // validated by Zod middleware
    const { name } = req.body;

    const updatedUser = await updateUserByName({
      userId,
      name,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("EditProfile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const resendVerificationLink = async (req, res) => {
  try {
    // ✅ req.user is NOT a promise
    console.log("REQ.USER 👉", req.user);

    // If user is not logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ use _id (safe with mongoose)
    const user = await findUserById(req.user.id);
    console.log("user :- ", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailValid) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // ✅ Sending the Verification Link (your service)
    await sendNewVerifyEmailLink({
      userId: user.id,
      email: user.email,
    });

    // ✅ React-friendly response
    return res.status(200).json({
      success: true,
      message: "Verification link sent to your email",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to resend verification link",
    });
  }
};

export const verifyEmailToken = async (req, res) => {
  try {
    // 1️⃣ Get token from URL (example: /verify-email/:token)
    const { token } = req.params;

    if (!token) {
      return res.status(400).send("Verification token missing");
    }

    // 2️⃣ Find token (using JOIN)c
    const tokenDoc = await findVerificationEmailToken({ token });

    console.log("🚀 VerifyEmailToken ~ Token :", tokenDoc);

    if (!tokenDoc || !tokenDoc.userId) {
      return res.status(400).send("Invalid or Expired Verification Token");
    }

    // ✅ Already verified case
    if (tokenDoc.userId.isEmailValid) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // 3️⃣ Verify user's email
    await verifyUserEmailAndUpdate(tokenDoc.userId._id);
    // 4️⃣ Clear verification tokens
    await clearVerifyEmailTokens(tokenDoc.userId._id);

    // ✅ JSON response (frontend will redirect)
    return res.status(200).json({
      message: "Email verified successfully. Please login.",
    });
  } catch (error) {
    console.error("❌ Verify Email Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const ChangePassword = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ USER:", req.user);

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    await updateUserPassword({ userId, newPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("ChangePassword Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// clgfriend --> bestfriend

export const ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    // Prevent email enumeration
    if (user) {
      const resetPasswordLink = await createResetPasswordLink({
        userId: user.id,
      });

      const html = await getHtmlfromMjmlTemplate("reset-password-email", {
        name: user.name,
        link: resetPasswordLink,
      });

      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*  LOGIC :-   postResetPasswordTokenData()
  1. Extract Reset Password Token from request parameters
  2. Validate Token Authenticity, Expiration and Match with a Previously Issued Token
  3. If Token is Valid, Get new Password from request body and Validate using ZOD Schema for Security
  4. Identify User Id linked to the Token
  5. Invalidate (Clear or Delete) all Existing Reset Password Tokens for that userId
  6. Hash the New Password with a Secure Hashing Algorithm
  7. Update the User's Password in the Database with the Hashed Token
  8. Redirect to LogIn Page or Return a Success Response
*/

export const ResetPasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetPasswordData = await getResetPasswordToken(token);

    if (!resetPasswordData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset password token",
      });
    }

    const user = await findUserById(resetPasswordData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Invalidate all reset tokens
    await clearResetPasswordToken(user.id);

    await updateUserPassword({
      userId: user.id,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("ResetPasswordToken Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ------------------- LOGIN WITH Google --------------------------------

export const getGoogleLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid", // this is called scopes, here we are giving openid, and profile
    "profile", // openid gives tokens if needed, and profile gives user information
    // we are telling google about the information that we require from user.
    "email",
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: "lax", // this is such that when google redirects to our website, cookies are maintained
  };

  res.cookie("google_oauth_state", state, cookieConfig);
  res.cookie("google_code_verifier", codeVerifier, cookieConfig);

  res.redirect(url.toString());
};


export const getGoogleLoginCallback = async (req, res) => {
  const { code, state } = req.query;
  console.log(code, state);

  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    // ✅ Sirf ek hi response — redirect with error
    return res.redirect("http://localhost:5173/login?error=invalid_attempt");
  }

  

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.log("Token validation failed:", error);
    // ✅ Return karo, aage mat jao
    return res.redirect("http://localhost:5173/login?error=token_failed");
  }

  console.log("token google: ", tokens);

  let claims;
  try {
    claims = decodeIdToken(tokens.idToken());
  } catch (error) {
    console.log("Token decode failed:", error);
    return res.redirect("http://localhost:5173/login?error=decode_failed");
  }

  console.log("claim: ", claims);

  const { sub: googleUserId, name, email, picture } = claims;

  let user = await getUserWithOAuthId({ provider: "google", email });

  if (user && !user.providerAccountId) {
    await linkUserWithOAuth({
      userId: user.id,
      provider: "google",
      providerAccountId: googleUserId,
      avatarUrl: picture,
    });
  }

  if (!user) {
    user = await createUserWithOAuth({
      name,
      email,
      provider: "google",
      providerAccountId: googleUserId,
      avatarUrl: picture,
    });
  }

  await authenticateUser({ req, res, user, name, email });

  return res.redirect("http://localhost:5173/"); // ✅ Frontend redirect
};


