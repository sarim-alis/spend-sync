"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import styles from "@/styles/home/home";
import { useAuth } from "@/context/AuthContext";
import { useSummaryQuery } from "@/queries/home/home";

export default function Home() {
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();
  const { data: summary, isLoading: loading } = useSummaryQuery(userId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <p>No data available</p>
      </div>
    );
  }

  const incomeTotal = summary.income || 0;
  const expenseTotal = summary.expenses || 0;
  const savingsTotal = summary.savings || 0;
  const remaining = summary.remaining || 0;

  const chartData = [
    { name: "Income", value: remaining, color: "#2d803bff" },
    { name: "Expenses", value: expenseTotal, color: "#ff6347" },
    { name: "Savings", value: savingsTotal, color: "#daa757" },
  ];

  return (
    <div className={styles.container}>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Money Distribution</h2>
        <ResponsiveContainer width="90%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        className={styles.card}
        onClick={() => router.push("/transactions?type=income")}
      >
        <div className={styles.cardContent}>
          <div className={styles.leftContent}>
            <h3 className={styles.cardTitle}>Income</h3>
            <p className={styles.amount}>${remaining}</p>
          </div>
          <div className={styles.rightContent}>
            <Image
              src="/income.jpg"
              alt="Income"
              width={64}
              height={64}
              className={styles.cardImage}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.cards}
        onClick={() => router.push("/transactions?type=expense")}
      >
        <div className={styles.cardContent}>
          <div className={styles.leftContent}>
            <h3 className={styles.cardTitle}>Expenses</h3>
            <p className={styles.amount}>${expenseTotal}</p>
          </div>
          <div className={styles.rightContent}>
            <Image
              src="/card.jpg"
              alt="Expenses"
              width={64}
              height={64}
              className={styles.cardImage}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.cardss}
        onClick={() => router.push("/transactions?type=saving")}
      >
        <div className={styles.cardContent}>
          <div className={styles.leftContent}>
            <h3 className={styles.cardTitle}>Savings</h3>
            <p className={styles.amount}>${savingsTotal}</p>
          </div>
          <div className={styles.rightContent}>
            <Image
              src="/coin.png"
              alt="Savings"
              width={80}
              height={80}
              className={styles.cardImages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
