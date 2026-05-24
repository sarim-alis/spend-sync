// src/routes/reportRoutes.js
// Imports.
import { Router } from "express";
import { getReport, getTotals } from "../controllers/reportController.js";

const router = Router();
router.get("/", getReport);
router.get('/totals', getTotals);

export default router;

