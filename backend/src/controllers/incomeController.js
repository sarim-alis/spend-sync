// src/controllers/incomeController.js
// Imports.
import prisma from "../lib/prisma.js";


// Create income.
export const createIncome = async (req, res) => {
  try {
    const { amount, source, userId } = req.body;

    const income = await prisma.income.create({
      data: { amount: parseFloat(amount), source, userId: Number(userId) },
    });

    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get incomes.
export const getIncomes = async (req, res) => {
  try {
    const { userId } = req.query;

    const incomes = await prisma.income.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


