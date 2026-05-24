import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import {
  userRoutes,
  incomeRoutes,
  savingRoutes,
  expenseRoutes,
  summaryRoutes,
  reportRoutes,
} from "./src/routes/index.js";

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

await fastify.register(cors);

fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(incomeRoutes, { prefix: "/api/incomes" });
fastify.register(savingRoutes, { prefix: "/api/savings" });
fastify.register(expenseRoutes, { prefix: "/api/expenses" });
fastify.register(summaryRoutes, { prefix: "/api/summary" });
fastify.register(reportRoutes, { prefix: "/api/reports" });

const start = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected 🐼");

    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running at http://localhost:${PORT} 🍂�⭐`);
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();