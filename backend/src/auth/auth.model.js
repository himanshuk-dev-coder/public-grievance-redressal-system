import mongoose from 'mongoose';

// ------------------ Click Logs ------------------
const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // CREATE, ASSIGN, STATUS_UPDATE
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["citizen", "officer", "admin"],
      required: true,
    },

    oldValue: Object,
    newValue: Object,
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

// ------------------ Notifications ------------------
const notificationSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: String,
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

// ------------------ Sessions ------------------
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  valid: { type: Boolean, default: true },
  userAgent: { type: String },
  ip: { type: String, maxlength: 255 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model('Session', sessionSchema);

// ------------------ Email Verification Tokens ------------------
const verifyEmailTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, maxlength: 8 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 1 day
  createdAt: { type: Date, default: Date.now }
});

export const VerifyEmailToken = mongoose.model('VerifyEmailToken', verifyEmailTokenSchema);

// ------------------ Password Reset Tokens ------------------
const resetPasswordTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 60 * 60 * 1000) }, // 1 hour
  createdAt: { type: Date, default: Date.now }
});

export const ResetPasswordToken = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);

// ------------------ OAuth Accounts ------------------
const oauthAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['google', 'github'], required: true },
  providerAccountId: { type: String, required: true, unique: true, maxlength: 255 },
  createdAt: { type: Date, default: Date.now }
});

export const OAuthAccount = mongoose.model('OAuthAccount', oauthAccountSchema);

