import express from "express";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";
import { authorize } from "../middlewares/RBAC.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

import {
  getAssignedComplaintsController,
  addOfficerRemark,
  closeComplaint,
  requestMoreInfo,
  uploadActionProof
} from "./officer.controller.js";
import { getComplaintByIdController } from "../complaints/complaint.controller.js";


const router = express.Router();

// OFFICER → View Assigned Complaints
router.get(
  "/complaints/assigned",
  requireAuth,
  authorize([PERMISSIONS.VIEW_ASSIGNED_COMPLAINTS]),
  getAssignedComplaintsController
);

// OFFICER → View Complaint by ID (citizen or officer)
router.get(
  "/complaints/:id",
  requireAuth,
  authorize([
    PERMISSIONS.VIEW_OWN_COMPLAINT,        // citizen can view own complaint
    PERMISSIONS.VIEW_ASSIGNED_COMPLAINTS   // officer can view assigned complaint
  ]),
  getComplaintByIdController
);

// OFFICER → Close Complaint
router.patch(
  "/complaints/:id/close",
  requireAuth,
  authorize([PERMISSIONS.CLOSE_COMPLAINT]),
  closeComplaint
);

// OFFICER → Add Officer Remark
router.post(
  "/complaints/:id/remark",
  requireAuth,
  authorize([PERMISSIONS.ADD_OFFICER_REMARK]),
  addOfficerRemark
);

// OFFICER → Request More Info
router.post(
  "/complaints/:id/request-info",
  requireAuth,
  authorize([PERMISSIONS.REQUEST_MORE_INFO]),
  requestMoreInfo
);

// OFFICER → Upload Action Proof
router.post(
  "/complaints/:id/action-proof",
  requireAuth,
  authorize([PERMISSIONS.UPLOAD_ACTION_PROOF]),
  uploadActionProof
);

export const officerRoutes = router;
