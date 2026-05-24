// src/controllers/expenseController.js
// Imports.
import prisma from "../lib/prisma.js";


// Create expense.
export const createExpense = async (req, res) => {
  try {
    const { amount, category, userId } = req.body;
    const parsedAmount = parseFloat(amount);
    const uid = Number(userId);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Step 1: Get total income, expenses, savings
    const incomeAgg = await prisma.income.aggregate({
      where: { userId: uid },
      _sum: { amount: true },
    });

    const expenseAgg = await prisma.expense.aggregate({
      where: { userId: uid },
      _sum: { amount: true },
    });

    const savingAgg = await prisma.saving.aggregate({
      where: { userId: uid },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    let totalSavings = savingAgg._sum.amount || 0;

    // Step 2: Calculate remaining balance in income
    const incomeBalance = totalIncome - totalExpense;

    // Step 3: Deduct expense
    if (parsedAmount <= incomeBalance) {
      // enough income balance
      const expenseRecord = await prisma.expense.create({
        data: { amount: parsedAmount, category, userId: uid },
      });
      return res.json(expenseRecord);
    } else {
      // expense exceeds income balance
      const remainingExpense = parsedAmount - incomeBalance;

      if (remainingExpense <= totalSavings) {
        // deduct from savings
        // Step 3a: Update savings - naive approach: subtract from first saving
        const firstSaving = await prisma.saving.findFirst({
          where: { userId: uid },
          orderBy: { id: "asc" },
        });

        await prisma.saving.update({
          where: { id: firstSaving.id },
          data: { amount: firstSaving.amount - remainingExpense },
        });

        const expenseRecord = await prisma.expense.create({
          data: { amount: parsedAmount, category, userId: uid },
        });

        return res.json(expenseRecord);
      } else {
        // not enough money
        return res.status(400).json({ error: "Insufficient funds (income + savings)" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const createExpense = async (req, res) => {
//   try {
//     const { amount, category, userId } = req.body;

//     const expense = await prisma.expense.create({
//       data: { amount: parseFloat(amount), category, userId: Number(userId) },
//     });

//     res.json(expense);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// Get expense.
export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    const expenses = await prisma.expense.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
