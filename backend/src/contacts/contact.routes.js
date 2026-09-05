import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from "./contact.controller.js";

const router = express.Router();

// Public
router.post("/", submitContact);

// Admin
router.get("/", getAllContacts);
router.put("/:id", updateContactStatus);

export const contactRoutes = router;