import express from "express";
import { createComplaintController, getAllComplaintsController, getComplaintByIdController, assignComplaintToOfficerController, updateComplaintStatusController, adminAnalyticsController, officerAnalyticsController, getComplaintTimelineController } from "./complaint.controller.js";

import { authorize } from "../middlewares/RBAC.middleware.js";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { getMyComplaints } from "../users/user.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();


// USER → Create Complaint
router.post("/", requireAuth, authorize([PERMISSIONS.CREATE_COMPLAINT]), upload.single("attachment"),
 createComplaintController);

// ADMIN / OFFICER → View All Complaints
router.get("/complaints", requireAuth, authorize([PERMISSIONS.VIEW_ALL_COMPLAINTS]), getAllComplaintsController);

// Timeline (must be before generic /:id
router.get("/:id/timeline",requireAuth,
  authorize([
    PERMISSIONS.VIEW_OWN_COMPLAINT,
    PERMISSIONS.VIEW_ALL_COMPLAINTS
  ]),
  getComplaintTimelineController
);

router.get("/admin", requireAuth, authorize([PERMISSIONS.VIEW_ANALYTICS]), adminAnalyticsController);

router.get("/officer", requireAuth, authorize([PERMISSIONS.VIEW_ANALYTICS]), officerAnalyticsController
);

// Get logged-in user's complaints
router.get("/my", requireAuth, authorize([PERMISSIONS.VIEW_OWN_COMPLAINT]), getMyComplaints);

// USER / OFFICER / ADMIN → Get Complaint By ID
router.get("/:id", requireAuth, authorize([PERMISSIONS.VIEW_OWN_COMPLAINT]), getComplaintByIdController);

// ADMIN → Assign Complaint
router.patch("/assign/:id", requireAuth, authorize([PERMISSIONS.ASSIGN_COMPLAINT]), assignComplaintToOfficerController);

// OFFICER / ADMIN → Update Status
router.patch("/status/:id", requireAuth, authorize([PERMISSIONS.UPDATE_COMPLAINT_STATUS]),
  updateComplaintStatusController);



export const complaintRoutes = router;
