// Imports
import React, { useState, useCallback } from "react";
import { ScrollView, View, Image, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRouter, useFocusEffect } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { API_BASE_URL } from "../../config/ip.js";
import styles from "../../styles/home/home.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Frontend
export default function Home() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

// Fetch summary.
useFocusEffect(
  useCallback(() => {
    const fetchSummary = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(`${API_BASE_URL}/api/summary/totals?userId=${userId}`);
        const data = await res.json();
        console.log("Summary Data:", data);
        setSummary(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [])
);

  // Loading.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No data available</Text>
      </View>
    );
  }

  // Pull values from API response
  const incomeTotal = summary.income || 0;
  const expenseTotal = summary.expenses || 0;
  const savingsTotal = summary.savings || 0;
  const remaining = summary.remaining || 0;

  // Chart Data
  const data = [
    { name: "Income", population: remaining, color: "#2d803bff", legendFontColor: "#333", legendFontSize: 14 },
    { name: "Expenses", population: expenseTotal, color: "tomato", legendFontColor: "#333", legendFontSize: 14 },
    { name: "Savings", population: savingsTotal, color: "#daa757", legendFontColor: "#333", legendFontSize: 14 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      
      {/* Pie Chart */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Income Distribution</Text>
        <PieChart data={data} width={screenWidth - 40} height={220} chartConfig={{ backgroundColor: "#fff", backgroundGradientFrom: "#fff", backgroundGradientTo: "#fff", color: (opacity = 1) => `rgba(0,0,0, ${opacity})`}} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} center={[0, 0]} />
      </View>

  {/* Income Card */}
  <TouchableOpacity onPress={() => router.push(`/transactions?type=income`)}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.cardTitle}>Income</Text>
            <Text style={styles.amount}>${remaining}</Text>
          </View>
          <View style={styles.rightContent}>
            <Image
              source={require("../../assets/images/income.jpg")}
              style={styles.cardImage}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>

  {/* Expense Card */}
  <TouchableOpacity onPress={() => router.push(`/transactions?type=expense`)}>
      <Card style={styles.cards}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.cardTitle}>Expenses</Text>
            <Text style={styles.amount}>${expenseTotal}</Text>
          </View>
          <View style={styles.rightContent}>
            <Image
              source={require("../../assets/images/card.jpg")}
              style={styles.cardImage}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>

  {/* Savings Card */}
  <TouchableOpacity onPress={() => router.push(`/transactions?type=saving`)}>
    <Card style={styles.cardss}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text style={styles.cardTitle}>Savings</Text>
            <Text style={styles.amount}>${savingsTotal}</Text>
          </View>
          <View style={styles.rightContent}>
            <Image
              source={require("../../assets/images/coin.png")}
              style={styles.cardImages}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
    </ScrollView>
  );
}
