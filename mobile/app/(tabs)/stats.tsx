//@ts-nocheck
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import styles from "../../styles/stats/stats.js";

interface StatsData {
  labels: string[];
  income: number[];
  expenses: number[];
  savings: number[];
}

export default function Stats() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [data, setData] = useState<StatsData>({ labels: [], income: [], expenses: [], savings: [] });
  const [loading, setLoading] = useState(true);

  const userId = 1;
  const screenWidth = Dimensions.get("window").width - 20;

  const fetchData = async (type: "daily" | "weekly" | "monthly") => {
    try {
      setLoading(true);
      const res = await fetch(`http://192.168.1.23:5000/api/reports?userId=${userId}&type=${type}`);
      const json = await res.json();
      setData({
        labels: Array.isArray(json.labels) ? json.labels : [],
        income: Array.isArray(json.income) ? json.income.map(Number) : [],
        expenses: Array.isArray(json.expenses) ? json.expenses.map(Number) : [],
        savings: Array.isArray(json.savings) ? json.savings.map(Number) : [],
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setData({ labels: [], income: [], expenses: [], savings: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(reportType);
  }, [reportType]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2d803b" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
    >
      <Text variant="headlineMedium" style={{ marginVertical: 20 }}>
        Stats 📊
      </Text>

      {/* Tabs */}
      <View style={styles.buttonContainer}>
        {["daily", "weekly", "monthly"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, reportType === type && { backgroundColor: "#2d803b" }]}
            onPress={() => setReportType(type as any)}
          >
            <Text style={[styles.tabText, reportType === type && styles.activeText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      {data.labels.length > 0 && (
        <LineChart
          data={{
            labels: data.labels,
            datasets: [
              { data: data.income, color: () => "#2d803b", strokeWidth: 2 },
              { data: data.expenses, color: () => "tomato", strokeWidth: 2 },
              { data: data.savings, color: () => "#daa757", strokeWidth: 2 },
            ],
            legend: ["Income", "Expenses", "Savings"],
          }}
          width={screenWidth}
          height={300}
          chartConfig={{
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 16 }}
        />
      )}

      {/* Stats Table */}
      {data.labels.length > 0 && (
        <View style={{ width: screenWidth, paddingHorizontal: 10, marginTop: 20 }}>
          {data.labels.map((label, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                padding: 12,
                borderRadius: 6,
                marginBottom: 5,
              }}
            >
              <Text style={{ flex: 1 }}>{label}</Text>
              <Text style={{ flex: 1 }}>Income: {data.income[index] || 0}</Text>
              <Text style={{ flex: 1 }}>Expense: {data.expenses[index] || 0}</Text>
              <Text style={{ flex: 1 }}>Savings: {data.savings[index] || 0}</Text>
            </View>
          ))}
        </View>
      )}

      {data.labels.length === 0 && <Text style={{ marginTop: 50 }}>No data to display</Text>}
    </ScrollView>
  );
}
