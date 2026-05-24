// src/routes/expenseRoutes.js
// Imports.
import { Router } from "express";
import { createExpense, getExpenses } from "../controllers/expenseController.js";

const router = Router();
router.post("/", createExpense);
router.get("/", getExpenses);

export default router;
