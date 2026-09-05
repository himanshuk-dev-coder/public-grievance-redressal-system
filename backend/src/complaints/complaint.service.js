import mongoose from "mongoose";
import { Complaint } from "./complaint.model.js";
import { User } from "../users/user.model.js";
import { AuditLog, Notification } from "../auth/auth.model.js";
import fs from "fs";

/**
 * Create a new complaint
 */
export const createComplaint = async (data) => {
  console.log("DATA :- ", data);
  if (!data.subject || !data.description) {
    throw new Error("Subject or Description is required");
  }
  console.log("DATA.ATTATCHMENTS :- ", data.attachments);
  // ✅ Ensure attachments is always an array
  if (data.attachments && !Array.isArray(data.attachments)) {
    throw new Error("Attachments must be an array");
  }

  const complaint = await Complaint.create({
    ...data,
    sla: {
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
  });

  return complaint;
};

// Get all complaints (Admin use)

export const getAllComplaints = async () => {
  return await Complaint.find()
    .populate("user", "name email")
    .populate("assignedOfficer", "name role department")
    .sort({ createdAt: -1 });
};

/**
 * Get complaint by ID
 */
export const getComplaintById = async (complaintId) => {
  if (!mongoose.Types.ObjectId.isValid(complaintId)) {
    return null;
  }

  const complaint = await Complaint.findById(complaintId)
    .populate("user", "_id name email")
    .populate("assignedOfficer", "_id name email");

  return complaint;
};

/**
 * Assign complaint to officer (Admin)
 */
export const assignComplaintToOfficer = async (complaintId, officerId) => {
  // 1️⃣ Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(complaintId) ||
    !mongoose.Types.ObjectId.isValid(officerId)
  ) {
    throw new Error("Invalid ID provided");
  }

  // 2️⃣ Validate officer
  const officer = await User.findById(officerId);
  if (!officer || officer.role !== "officer") {
    throw new Error("Invalid officer");
  }

  // 3️⃣ Fetch complaint first (important for checks)
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new Error("Complaint not found");
  }

  // 4️⃣ Prevent reassignment
  if (complaint.assignedOfficer) {
    throw new Error("Complaint already assigned to an officer");
  }

  if (complaint.status === "Resolved") {
    throw new Error("Resolved complaints cannot be assigned");
  }

  // 5️⃣ Assign complaint
  complaint.officerId = officerId;
  complaint.assignedOfficer = officerId;
  complaint.status = "IN_PROGRESS";

  await complaint.save();

  return complaint;
};

// Update complaint status (Officer)

export const updateComplaintStatus = async (complaintId, status, remark) => {
  const allowedStatus = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid complaint status");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new Error("Complaint not found");
  }

  complaint.status = status;

  if (remark) {
    complaint.remarks = remark;
  }

  await complaint.save();
  return complaint;
};

export const createAuditLog = async ({action, role, performedBy, complaintId, user, oldValue = {},
  newValue = {} }) => {
  try {
    if (!action || !complaintId || !user || !role || !performedBy) return;

    await AuditLog.create({
      action,
      role,
      performedBy,
      complaintId,
      user: user._id || user,
      oldValue,
      newValue,
    });
  } catch (error) {
    console.log("AuditLog ERROR :- ", error.message);
  }
};

export const getComplaintTimeLine = async ({ complaintId }) => {
  return await AuditLog.find({ complaint: complaintId })
    .populate("performedBy", "name role")
    .sort({ createdAt: 1 });
};

export const notifyUser = async (userId, message) => {
  await Notification.create({
    user: userId,
    message,
  });
};

// -------------------- Complaint Analytics ------------------------

export const getAdminAnalytics = async () => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      rejectedComplaints,
      inProgressComplaints,
      totalOfficers,
      totalUsers,
      complaintsByCategory,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "PENDING" }),
      Complaint.countDocuments({ status: "RESOLVED" }),
      Complaint.countDocuments({ status: "REJECTED" }),
      Complaint.countDocuments({ status: "IN_PROGRESS" }),
      User.countDocuments({ role: "officer" }), // 🔥 THIS LINE
      User.countDocuments({ role: "citizen" }),

      // 🔥 Department-wise aggregation
      Complaint.aggregate([
        {
          $group: {
            _id: "$department", // or "$department"
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
          },
        },
      ]),
    ]);
    const complaintsTrend = await Complaint.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d", // daily
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          complaints: "$count",
        },
      },
    ]);

    const officerPerformance = await Complaint.aggregate([
      {
        $match: {
          assignedOfficer: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedOfficer",
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "officer",
        },
      },
      { $unwind: "$officer" },
      {
        $project: {
          _id: 0,
          officerName: "$officer.name",
          totalAssigned: 1,
          resolved: 1,
          pending: 1,
          rejected: 1
        },
      },
    ]);
    console.log(officerPerformance);
    return {
      totalComplaints,
      totalOfficers,
      totalUsers,
      complaintsByStatus: [
        { name: "PENDING", value: pendingComplaints },
        { name: "IN_PROGRESS", value: inProgressComplaints },
        { name: "RESOLVED", value: resolvedComplaints },
        { name: "REJECTED", value: rejectedComplaints },
      ],
      complaintsByCategory, // ✅ ADD THIS
      complaintsTrend,
      officerPerformance,

    };
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
};

export const getOfficerAnalytics = async (officerId) => {
  if (!officerId || !mongoose.Types.ObjectId.isValid(officerId)) {
    throw new Error("Invalid officer ID");
  }

  const officerObjectId = new mongoose.Types.ObjectId(officerId);

  const [assigned, statusWiseRaw] = await Promise.all([
    Complaint.countDocuments({ assignedOfficer: officerObjectId }),

    Complaint.aggregate([
      { $match: { assignedOfficer: officerObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Normalize for frontend
  const statusWise = {
    PENDING: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    REJECTED: 0,
  };

  statusWiseRaw.forEach((item) => {
    statusWise[item._id] = item.count;
  });

  return {
    assigned,
    statusWise,
  };
};

/**
 * UPDATE COMPLAINT (ONLY IF NOT CLOSED)
 */
export const updateComplaintByUser = async (
  complaintId,
  userId,
  updateData,
) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    userId,
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized to update this complaint");
  }

  if (complaint.status === "closed") {
    throw new ApiError(400, "Closed complaints cannot be updated");
  }

  Object.assign(complaint, updateData);
  await complaint.save();

  return complaint;
};

// DELETE COMPLAINT (ONLY IF NOT ASSIGNED)
export const deleteComplaintByUser = async (complaintId, userId) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    userId,
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized to delete this complaint");
  }

  if (complaint.assignedOfficer) {
    throw new ApiError(400, "Assigned complaints cannot be deleted");
  }

  await complaint.deleteOne();
};

// ADD COMMENT

export const addCommentService = async ({ complaintId, userId, text }) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    userId,
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized to comment");
  }

  const comment = {
    text,
    author: userId,
    role: "citizen",
    createdAt: new Date(),
  };

  complaint.comments.push(comment);
  await complaint.save();

  return comment;
};

// UPLOAD PROOF

export const uploadComplaintProofService = async ({
  complaintId,
  userId,
  file,
}) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    userId,
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized to upload proof");
  }

  const proof = {
    filename: file.originalname,
    path: file.path,
    uploadedAt: new Date(),
  };

  complaint.proofs.push(proof);
  await complaint.save();

  return proof;
};
