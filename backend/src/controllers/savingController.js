// src/controllers/savingController.js
// Imports.
import prisma from "../lib/prisma.js";


// Create saving.
export const createSaving = async (req, res) => {
  try {
    const { amount, goal, userId } = req.body;

    const saving = await prisma.saving.create({
      data: { amount: parseFloat(amount), goal, userId: Number(userId) },
    });

    res.json(saving);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get savings.
export const getSavings = async (req, res) => {
  try {
    const { userId } = req.query;

    const savings = await prisma.saving.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(savings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
