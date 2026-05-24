import prisma from "../lib/prisma.js";

export const createIncome = async (request, reply) => {
  try {
    const { amount, source, userId } = request.body;

    const income = await prisma.income.create({
      data: { amount: parseFloat(amount), source, userId: Number(userId) },
    });

    reply.send(income);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

export const getIncomes = async (request, reply) => {
  try {
    const { userId } = request.query;

    const incomes = await prisma.income.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    reply.send(incomes);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};
