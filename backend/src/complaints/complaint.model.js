import mongoose from "mongoose";

/* 🔹 Attachment Sub-Schema */
const attachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String, // original file name
      required: true,
    },
    url: {
      type: String, // cloudinary url OR local path
      required: true,
    },
    mimeType: {
      type: String,
    },
    size: {
      type: Number,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    ministry: {
      type: String,
      
    },
    department: {
      type: String,
      
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer", // 👈 MUST match model name
      default: null,
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location: {
      
    },
    /* 🔹 Attachments */
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    sla: {
      deadline: Date,
      breached: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

// Add Geo Index (IMPORTANT)
// complaintSchema.index({ location: "2dsphere" });

export const Complaint = mongoose.model("Complaint", complaintSchema);
