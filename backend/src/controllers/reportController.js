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

// Get report (time-series)
export const getReport = async (req, res) => {
  try {
    const { userId, type } = req.query;

    if (!userId || !type)
      return res.status(400).json({ error: "userId and type required" });

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId))
      return res.status(400).json({ error: "Invalid userId" });

    const now = new Date();
    let start, end, labels, intervalKey;

    if (type === "daily") {
      // Show last 7 days (Monday to Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      start = new Date(startOfWeek);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(startOfWeek);
      end.setDate(startOfWeek.getDate() + 6); // Sunday
      end.setHours(23, 59, 59, 999);

      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      intervalKey = "day";
    } else if (type === "weekly") {
      // Show last 4 weeks
      start = new Date(now);
      start.setDate(now.getDate() - 27); // 4 weeks ago
      start.setHours(0, 0, 0, 0);
      
      end = new Date(now);
      end.setHours(23, 59, 59, 999);

      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      intervalKey = "week";
    } else if (type === "monthly") {
      // Show current year quarterly (Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec)
      start = new Date(now.getFullYear(), 0, 1); // January 1st
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st

      labels = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
      intervalKey = "quarter";
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Fetch incomes and expenses
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

    // Group and sum data based on interval
    const groupData = (data, intervalKey) => {
      const grouped = {};
      
      data.forEach(item => {
        const date = new Date(item.createdAt);
        let key;
        
        if (intervalKey === "day") {
          key = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to Mon=0, Tue=1, etc.
        } else if (intervalKey === "week") {
          const weeksDiff = Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000));
          key = Math.min(weeksDiff, 3); // Ensure max 4 weeks (0-3)
        } else if (intervalKey === "quarter") {
          const month = date.getMonth();
          key = Math.floor(month / 3); // 0=Q1, 1=Q2, 2=Q3, 3=Q4
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

    res.json({
      labels,
      income: incomeData,
      expenses: expenseData,
      savings: savingsData,
    });
  } catch (err) {
    console.error("Error in getReport:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getTotals = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Aggregate totals
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

    // Replace income with remaining
    const remaining = incomeTotal - (expenseTotal + savingTotal);

    res.json({
      income: remaining,  // 👈 replaced here
      expenses: expenseTotal,
      savings: savingTotal,
    });
  } catch (err) {
    console.error("Error in getTotals:", err);
    res.status(500).json({ error: "Server error" });
  }
};
