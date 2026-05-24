// Imports.
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./src/routes/userRoutes.js";
import incomeRoutes from "./src/routes/incomeRoutes.js";
import savingRoutes from "./src/routes/savingRoutes.js";
import expenseRoutes from "./src/routes/expenseRoutes.js";
import summaryRoutes from "./src/routes/summaryRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

// App.
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware.
app.use(cors());
app.use(express.json());

// Routes.
app.use("/api/users", userRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/reports", reportRoutes);


// Server.
async function startServer() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected 🐼");

    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT} 🍂🎨⭐`));
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
