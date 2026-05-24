// src/routes/summaryRoutes.js
// Imports.
import { Router } from "express";
import { getSummary, getTotals } from "../controllers/summaryController.js";

const router = Router();
router.get("/", getSummary);
router.get("/totals", getTotals)

export default router;
