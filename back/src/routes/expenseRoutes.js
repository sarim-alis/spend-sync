import { createExpense, getExpenses } from "../controllers/expenseController.js";

async function expenseRoutes(fastify, options) {
  fastify.post("/", createExpense);
  fastify.get("/", getExpenses);
}

export default expenseRoutes;
