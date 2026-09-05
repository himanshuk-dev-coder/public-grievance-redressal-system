// user.controller.js
import { addCommentService, deleteComplaintByUser, updateComplaintByUser, uploadComplaintProofService } from "../complaints/complaint.service.js";

import {Complaint} from "../complaints/complaint.model.js";

export const getMyComplaints = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "citizen") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const complaints = await Complaint.find({
      user: req.user.id, // ✅ FIXED
    })
      .sort({ createdAt: -1 })
      .select("_id subject category status createdAt");
  
    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("getMyComplaints error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};


// Update Complaint
export const updateMyComplaint = async (req, res) => {
  const updated = await updateComplaintByUser(
    req.params.id,
    req.user._id,
    req.body
  );
  return res.json({ success: true, data: updated });
};

// Delete Complaint
export const deleteMyComplaint = async (req, res) => {
  await deleteComplaintByUser(req.params.id, req.user._id);
  return res.json({ success: true, message: "Complaint deleted successfully" });
};

// Add Comment
export const addComment = async (req, res) => {
  const comment = await addCommentService({
    complaintId: req.params.id,
    userId: req.user._id,
    text: req.body.text
  });
  return res.json({ success: true, data: comment });
};

// Upload Proof
export const uploadComplaintProof = async (req, res) => {
  const proof = await uploadComplaintProofService({
    complaintId: req.params.id,
    userId: req.user._id,
    file: req.file
  });
  return res.json({ success: true, data: proof });
};
