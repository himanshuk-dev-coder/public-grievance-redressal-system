import express from "express";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";
import { authorize } from "../middlewares/RBAC.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

import { updateMyComplaint, deleteMyComplaint, addComment, uploadComplaintProof, getMyComplaints } from "./user.controller.js";

const router = express.Router();
// USER → Get Complaint By ID
// router.get("/my", requireAuth , getMyComplaints);

// USER / OFFICER / ADMIN → Get Complaint By ID
// router.get("/:id", requireAuth, authorize([PERMISSIONS.VIEW_OWN_COMPLAINT]), getComplaintByIdController);



// Edit Complaint
router.patch("/complaints/:id", requireAuth, authorize([PERMISSIONS.EDIT_OWN_COMPLAINT]),
  updateMyComplaint);

// Delete Complaint
router.delete("/complaints/:id", requireAuth, authorize([PERMISSIONS.DELETE_OWN_COMPLAINT]),
  deleteMyComplaint);

// Add Comment
router.post("/complaints/:id/comment", requireAuth, authorize([PERMISSIONS.ADD_COMPLAINT_COMMENT]),
  addComment);

// Upload Proof
router.post("/complaints/:id/proof", requireAuth, authorize([PERMISSIONS.UPLOAD_COMPLAINT_PROOF]),
  uploadComplaintProof);

export const userRoutes = router;
