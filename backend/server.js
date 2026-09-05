import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import requestIp from "request-ip";
import { connectDB } from "./src/config/db.js";

import { verifyAuthentication } from "./src/middlewares/verify-auth-middleware.js";

import { contactRoutes } from "./src/contacts/contact.routes.js";
import { authRoutes } from "./src/auth/auth.routes.js";
import { userRoutes } from "./src/users/user.routes.js";
import { complaintRoutes } from "./src/complaints/complaint.routes.js";
import { adminRoutes } from "./src/admin/admin.routes.js";
import { officerRoutes } from "./src/officer/officer.routes.js";
import { ministryRoutes } from "./src/ministry/ministry.routes.js";
import { feedBackRoutes } from "./src/feedbacks/feedback.routes.js";

const app = express();

// ================== MIDDLEWARES ==================

// ✅ 1. CORS first — must be before anything reads the request
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ 2. Cookie parser before routes and session
app.use(cookieParser());

// ✅ 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. Session after cookie-parser
app.use(session({
  secret: process.env.SESSION_SECRET || "my-secret",
  resave: true,
  saveUninitialized: true,  // ✅ must be true so session exists before login
  cookie: {
    httpOnly: true,
    secure: false,          // ✅ false for localhost http
    sameSite: "lax",
    maxAge: 5 * 60 * 1000, // 5 mins is enough for the OAuth round trip
    path: "/",
  },
    
}));

// ✅ 5. Static files
app.use("/uploads", express.static("uploads"));

// ✅ 6. IP middleware
app.use(requestIp.mw());

// ✅ 7. Auth middleware last (needs cookies + session ready)
app.use(verifyAuthentication);

app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});


// ================== ROUTES ==================
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/feedback", feedBackRoutes);

app.get("/", (req, res) => {
  res.send("PGRS API is running 🚀");
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ success: false, error: err.message });
});

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();