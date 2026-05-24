import prisma from "../lib/prisma.js";

export const getSummary = async (request, reply) => {
  try {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return reply.status(400).send({ error: "Invalid userId" });
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

    reply.send({
      income: incomeTotal,
      expenses: expenseTotal,
      savings: savingTotal,
      remaining,
    });
  } catch (err) {
    console.error("Error in getSummary:", err);
    reply.status(500).send({ error: "Server error" });
  }
};

export const getTotals = async (request, reply) => {
  try {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return reply.status(400).send({ error: "Invalid userId" });
    }

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

    let remainingIncome = totalIncome - totalExpense;
    let savingsUsed = 0;

    if (remainingIncome < 0) {
      savingsUsed = -remainingIncome;
      remainingIncome = 0;
    }

    let remainingSavings = totalSavings - savingsUsed;
    if (remainingSavings < 0) remainingSavings = 0;

    reply.send({
      income: totalIncome,
      expenses: totalExpense,
      savings: remainingSavings,
      remaining: remainingIncome,
    });
  } catch (err) {
    console.error("Error in getTotals:", err);
    reply.status(500).send({ error: "Server error" });
  }
};
