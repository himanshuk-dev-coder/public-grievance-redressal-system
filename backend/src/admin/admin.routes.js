import express from "express";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";
import { authorize } from "../middlewares/RBAC.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

import {
  createOfficerController,
  getAllUsersController,
  reassignComplaint,
  changeUserRole,
  updateOfficerDepartment,
  deleteOfficer,
  closeComplaint,
  deleteComplaint,
  updateComplaintByAdmin
} from "./admin.controller.js";

const router = express.Router();

// ------------------------- USER MANAGEMENT -------------------------

import { getAllOfficersController } from "./admin.controller.js";

// ADMIN → View All Officers
router.get("/officers", requireAuth, authorize([PERMISSIONS.VIEW_ALL_OFFICERS]), getAllOfficersController);

// ADMIN → Create Officer
router.post("/create-officer", requireAuth, authorize([PERMISSIONS.CREATE_OFFICER]), createOfficerController);

// ADMIN → View All User
router.get("/users", requireAuth, authorize([PERMISSIONS.VIEW_ALL_USERS]), getAllUsersController);

// Delete officer
router.delete("/officers/:id", requireAuth, authorize([PERMISSIONS.DELETE_OFFICER]),
  deleteOfficer
);

// Change user role
router.patch("/users/:id/role", requireAuth, authorize([PERMISSIONS.CHANGE_USER_ROLE]),
  changeUserRole
);

// ADMIN → Update officer department  ✅ (FIXES YOUR 404)
router.patch(
  "/officers/:id",
  requireAuth,
  authorize([PERMISSIONS.UPDATE_OFFICER_DEPARTMENT]), // or UPDATE_OFFICER if exists
  updateOfficerDepartment
);

// ------------------------ COMPLAINT MANAGEMENT -----------------------

// 🔧 Update complaint (PATCH)
router.patch("/complaints/:id", updateComplaintByAdmin);


// Reassign complaint
router.patch("/complaints/reassign/:id", requireAuth, authorize([PERMISSIONS.REASSIGN_COMPLAINT]),
  reassignComplaint
);

// Close complaint
router.patch(
  "/complaints/close/:id",
  requireAuth,
  authorize([PERMISSIONS.CLOSE_COMPLAINT]),
  closeComplaint
);

// Delete any complaint
router.delete(
  "/complaints/:id",
  requireAuth,
  authorize([PERMISSIONS.DELETE_ANY_COMPLAINT]),
  deleteComplaint
);


export const adminRoutes = router;

