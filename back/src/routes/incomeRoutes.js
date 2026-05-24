import { createIncome, getIncomes } from "../controllers/incomeController.js";

async function incomeRoutes(fastify, options) {
  fastify.post("/", createIncome);
  fastify.get("/", getIncomes);
}

export default incomeRoutes;
