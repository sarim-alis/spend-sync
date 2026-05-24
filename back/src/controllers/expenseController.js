import prisma from "../lib/prisma.js";

export const createExpense = async (request, reply) => {
  try {
    const { amount, category, userId } = request.body;
    const parsedAmount = parseFloat(amount);
    const uid = Number(userId);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return reply.status(400).send({ error: "Invalid amount" });
    }

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

    const incomeBalance = totalIncome - totalExpense;

    if (parsedAmount <= incomeBalance) {
      const expenseRecord = await prisma.expense.create({
        data: { amount: parsedAmount, category, userId: uid },
      });
      return reply.send(expenseRecord);
    } else {
      const remainingExpense = parsedAmount - incomeBalance;

      if (remainingExpense <= totalSavings) {
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

        return reply.send(expenseRecord);
      } else {
        return reply.status(400).send({ error: "Insufficient funds (income + savings)" });
      }
    }
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

export const getExpenses = async (request, reply) => {
  try {
    const { userId } = request.query;

    const expenses = await prisma.expense.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    reply.send(expenses);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};
