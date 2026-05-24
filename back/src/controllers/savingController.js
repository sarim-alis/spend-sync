import prisma from "../lib/prisma.js";

export const createSaving = async (request, reply) => {
  try {
    const { amount, goal, userId } = request.body;

    const saving = await prisma.saving.create({
      data: { amount: parseFloat(amount), goal, userId: Number(userId) },
    });

    reply.send(saving);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

export const getSavings = async (request, reply) => {
  try {
    const { userId } = request.query;

    const savings = await prisma.saving.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    reply.send(savings);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};
