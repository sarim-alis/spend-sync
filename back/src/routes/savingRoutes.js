import { createSaving, getSavings } from "../controllers/savingController.js";

async function savingRoutes(fastify, options) {
  fastify.post("/", createSaving);
  fastify.get("/", getSavings);
}

export default savingRoutes;
