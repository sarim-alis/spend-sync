import { getReport, getTotals } from "../controllers/reportController.js";

async function reportRoutes(fastify, options) {
  fastify.get("/", getReport);
  fastify.get("/totals", getTotals);
}

export default reportRoutes;
