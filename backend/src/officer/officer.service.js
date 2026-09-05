import mongoose from "mongoose";
import {Complaint} from "../complaints/complaint.model.js";
import {User} from "../users/user.model.js";


export const getAssignedComplaints = async (officerId) => {
  if (!mongoose.Types.ObjectId.isValid(officerId)) {
    throw new Error("Invalid officer ID");
  }

  const officer = await User.findById(officerId).select("role");

  if (!officer) {
    throw new Error("Officer not found");
  }

  if (officer.role !== "officer") {
    throw new Error("Access denied");
  }

  const complaints = await Complaint.find({
    assignedOfficer: officerId
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return complaints;
};


export const closeComplaintService = async ({complaintId, userId, role, remark}) => {
  const query =
    role === "admin"
      ? { _id: complaintId }
      : { _id: complaintId, assignedOfficer: userId };

  const complaint = await Complaint.findOne(query);

  if (!complaint) {
    throw new ApiError(
      403,
      "Not authorized to close this complaint"
    );
  }

  if (complaint.status === "closed") {
    throw new ApiError(400, "Complaint already closed");
  }

  complaint.status = "closed";
  complaint.closedAt = new Date();
  complaint.closingRemark = {
    text: remark,
    closedBy: userId,
    role,
    createdAt: new Date()
  };

  await complaint.save();

  return complaint;
};


// Officer updates complaint status
 
// export const updateComplaintStatus = async (officerId, complaintId, status, remark) => {
//   const allowedStatus = ["IN_PROGRESS", "RESOLVED"];

//   if (!allowedStatus.includes(status)) {
//     throw new Error("Invalid status update");
//   }

//   const complaint = await Complaint.findById(complaintId);
//   if (!complaint) {
//     throw new Error("Complaint not found");
//   }

//   if (complaint.assignedOfficer.toString() !== officerId) {
//     throw new Error("Unauthorized complaint access");
//   }

//   complaint.status = status;
//   if (remark) complaint.remarks = remark;

//   await complaint.save();
//   return complaint;
// };

// Add officer remark
export const addOfficerRemarkService = async ({complaintId, officerId, text}) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    assignedOfficer: officerId
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized");
  }

  const remark = {
    text,
    officer: officerId,
    createdAt: new Date()
  };

  complaint.officerRemarks.push(remark);
  await complaint.save();

  return remark;
};

// Request more info

export const requestMoreInfoService = async (complaintId, officerId, message) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    assignedOfficer: officerId
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized");
  }

  complaint.status = "pending_user_response";
  complaint.moreInfoRequest = {
    message,
    requestedAt: new Date()
  };

  await complaint.save();
};

/**
 * Upload action proof
 */
export const uploadActionProofService = async ({complaintId,officerId,file}) => {
  const complaint = await Complaint.findOne({
    _id: complaintId,
    assignedOfficer: officerId
  });

  if (!complaint) {
    throw new ApiError(403, "Unauthorized");
  }

  const proof = {
    filename: file.originalname,
    path: file.path,
    uploadedAt: new Date()
  };

  complaint.actionProofs.push(proof);
  await complaint.save();

  return proof;
};


