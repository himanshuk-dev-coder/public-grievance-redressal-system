import express from "express";
import {
  addFeedback,
  getFeedbackByComplaint,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
} from "../feedbacks/feedback.controller.js";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";

const router = express.Router();

// Add feedback
router.post("/:complaintId", requireAuth, addFeedback);

// Get feedback for a complaint
router.get("/complaint/:complaintId", requireAuth, getFeedbackByComplaint);

// Update feedback
router.put("/:id", requireAuth, updateFeedback);

// Delete feedback
router.delete("/:id", requireAuth, deleteFeedback);

// Feedback Stats
router.get("/stats", requireAuth, getFeedbackStats);


export const feedBackRoutes = router;