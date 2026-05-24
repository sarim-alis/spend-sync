import { 
  eachDayOfInterval, 
  format, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth 
} from "date-fns";
import prisma from "../lib/prisma.js";

export const getReport = async (request, reply) => {
  try {
    const { userId, type } = request.query;

    if (!userId || !type)
      return reply.status(400).send({ error: "userId and type required" });

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId))
      return reply.status(400).send({ error: "Invalid userId" });

    const now = new Date();
    let start, end, labels, intervalKey;

    if (type === "daily") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      start = new Date(startOfWeek);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      intervalKey = "day";
    } else if (type === "weekly") {
      start = new Date(now);
      start.setDate(now.getDate() - 27);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(now);
      end.setHours(23, 59, 59, 999);

      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      intervalKey = "week";
    } else if (type === "monthly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      labels = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
      intervalKey = "quarter";
    } else {
      return reply.status(400).send({ error: "Invalid type" });
    }

    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where: { 
          userId: parsedUserId, 
          createdAt: { gte: start, lte: end } 
        },
      }),
      prisma.expense.findMany({
        where: { 
          userId: parsedUserId, 
          createdAt: { gte: start, lte: end } 
        },
      }),
    ]);

    const groupData = (data, intervalKey) => {
      const grouped = {};
      
      data.forEach(item => {
        const date = new Date(item.createdAt);
        let key;
        
        if (intervalKey === "day") {
          key = date.getDay() === 0 ? 6 : date.getDay() - 1;
        } else if (intervalKey === "week") {
          const weeksDiff = Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000));
          key = Math.min(weeksDiff, 3);
        } else if (intervalKey === "quarter") {
          const month = date.getMonth();
          key = Math.floor(month / 3);
        }
        
        if (key >= 0 && key < labels.length) {
          grouped[key] = (grouped[key] || 0) + Number(item.amount);
        }
      });
      
      return labels.map((_, index) => grouped[index] || 0);
    };

    const incomeData = groupData(incomes, intervalKey);
    const expenseData = groupData(expenses, intervalKey);
    const savingsData = incomeData.map((income, index) => income - expenseData[index]);

    reply.send({
      labels,
      income: incomeData,
      expenses: expenseData,
      savings: savingsData,
    });
  } catch (err) {
    console.error("Error in getReport:", err);
    reply.status(500).send({ error: "Server error" });
  }
};

export const getTotals = async (request, reply) => {
  try {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return reply.status(400).send({ error: "Invalid userId" });
    }

    const income = await prisma.income.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const expense = await prisma.expense.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const saving = await prisma.saving.aggregate({
      where: { userId: parsedUserId },
      _sum: { amount: true },
    });

    const incomeTotal = income._sum.amount || 0;
    const expenseTotal = expense._sum.amount || 0;
    const savingTotal = saving._sum.amount || 0;

    const remaining = incomeTotal - (expenseTotal + savingTotal);

    reply.send({
      income: remaining,
      expenses: expenseTotal,
      savings: savingTotal,
    });
  } catch (err) {
    console.error("Error in getTotals:", err);
    reply.status(500).send({ error: "Server error" });
  }
};
