// src/routes/incomeRoutes.js
// Imports.
import { Router } from "express";
import { createIncome, getIncomes } from "../controllers/incomeController.js";

const router = Router();
router.post("/", createIncome);
router.get("/", getIncomes);

export default router;

