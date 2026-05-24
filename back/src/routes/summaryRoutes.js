import { getSummary, getTotals } from "../controllers/summaryController.js";

async function summaryRoutes(fastify, options) {
  fastify.get("/", getSummary);
  fastify.get("/totals", getTotals);
}

export default summaryRoutes;
