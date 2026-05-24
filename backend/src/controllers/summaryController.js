// src/controllers/summaryController.js
// Imports.
import prisma from "../lib/prisma.js";


// Get summary.
export const getSummary = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const income = await prisma.income.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const expense = await prisma.expense.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const saving = await prisma.saving.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const incomeTotal = income._sum.amount || 0;
    const expenseTotal = expense._sum.amount || 0;
    const savingTotal = saving._sum.amount || 0;
    const remaining = incomeTotal - expenseTotal - savingTotal;

    res.json({
      income: incomeTotal,
      expenses: expenseTotal,
      savings: savingTotal,
      remaining,
    });
  } catch (err) {
    console.error("Error in getSummary:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTotals = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Step 1: Aggregate totals
    const incomeAgg = await prisma.income.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const expenseAgg = await prisma.expense.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const savingAgg = await prisma.saving.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    const totalSavings = savingAgg._sum.amount || 0;

    // Step 2: Calculate remaining balances
    let remainingIncome = totalIncome - totalExpense;
    let savingsUsed = 0;

    if (remainingIncome < 0) {
      // part of expense was paid from savings
      savingsUsed = -remainingIncome;
      remainingIncome = 0;
    }

    let remainingSavings = totalSavings - savingsUsed;
    if (remainingSavings < 0) remainingSavings = 0;

    // Step 3: Return totals
    res.json({
      income: totalIncome,
      expenses: totalExpense,
      savings: remainingSavings,
      remaining: remainingIncome,
    });
  } catch (err) {
    console.error("Error in getTotals:", err);
    res.status(500).json({ error: "Server error" });
  }
};
