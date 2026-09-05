import express from "express";
import {
  getMinistries,
  getDepartmentsByMinistry,
} from "./ministry.controller.js";

const router = express.Router();

router.get("/", getMinistries);
router.get("/:ministry", getDepartmentsByMinistry);

export const ministryRoutes = router;
