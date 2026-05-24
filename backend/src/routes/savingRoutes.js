// src/routes/savingRoutes.js
// Imports.
import { Router } from "express";
import { createSaving, getSavings } from "../controllers/savingController.js";

const router = Router();
router.post("/", createSaving);
router.get("/", getSavings);

export default router;
