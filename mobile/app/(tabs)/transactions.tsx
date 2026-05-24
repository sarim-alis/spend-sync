//@ts-nocheck
// Imports.
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, Card } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/ip.js";
import styles from "../../styles/transactions/transactions.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Frontend.
export default function Transactions() {
  // States.
  const [selectedType, setSelectedType] = useState<"income" | "expense" | "saving"| "total" | null>("income");
  const [incomeSources, setIncomeSources] = useState<any[]>([]);
  const [expenseSources, setExpenseSources] = useState<any[]>([]);
  const [savingSources, setSavingSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const amountColors = {income: "#2d803bff", expense: "tomato", saving: "#daa757"};
  const formatAmount = (type: string, amount: number) => { const formatted = amount.toLocaleString(); if (type === "income") return `+$${formatted}`; if (type === "expense") return `-$${formatted}`; return `$${formatted}`};

  // Fetch income.
  const fetchIncomes = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API_BASE_URL}/api/incomes?userId=${userId}`);
      const data = await res.json();

      const mapped = data.map((item: any) => ({ id: item.id.toString(), title: item.source, amount: item.amount, icon: require("../../assets/images/salary.png"), createdAt: new Date(item.createdAt)}));

      setIncomeSources(mapped);
    } catch (err) {
      console.error("Error fetching incomes:", err);
    }
  }, []);

  // Fetch expenses.
  const fetchExpenses = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API_BASE_URL}/api/expenses?userId=${userId}`);
      const data = await res.json();

      const mapped = data.map((item: any) => ({ id: item.id.toString(), title: item.category, amount: item.amount, icon: require("../../assets/images/pizza.png"), createdAt: new Date(item.createdAt)}));

      setExpenseSources(mapped);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }, []);

  // Fetch savings.
  const fetchSavings = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`${API_BASE_URL}/api/savings?userId=${userId}`);
      const data = await res.json();

      const mapped = data.map((item: any) => ({ id: item.id.toString(), title: item.goal, amount: item.amount, icon: require("../../assets/images/coins.png"), createdAt: new Date(item.createdAt)}));

      setSavingSources(mapped);
    } catch (err) {
      console.error("Error fetching savings:", err);
    }
  }, []);

  // Fetch data.
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchIncomes(), fetchExpenses(), fetchSavings()]);
      setLoading(false);
    };
    loadData();
  }, [fetchIncomes, fetchExpenses, fetchSavings]);

  useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchIncomes(), fetchExpenses(), fetchSavings()]);
      setLoading(false);
    };
    loadData();
  }, [fetchIncomes, fetchExpenses, fetchSavings])
);

// Merge all transactions and add type
const allData = [
  ...incomeSources.map(i => ({ ...i, type: "income", createdAt: new Date(i.createdAt) })),
  ...expenseSources.map(e => ({ ...e, type: "expense", createdAt: new Date(e.createdAt) })),
  ...savingSources.map(s => ({ ...s, type: "saving", createdAt: new Date(s.createdAt) }))
];

// Filter and sort based on selected type
const data =
  selectedType === "total"
    ? [...allData].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : allData
        .filter(item => item.type === selectedType)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Format date.
const formatDate = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const hh = String(hours).padStart(2, "0");

  return `${mm}/${dd}/${yyyy} ${hh}:${minutes}`;
};






  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ marginBottom: 20 }}>Transactions 🧾</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}><FontAwesome5 name="plus" size={18} color="#fff" /></TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.tab, selectedType === "income" && styles.incomeTab]} onPress={() => setSelectedType("income")}><Text style={[styles.tabText, selectedType === "income" && styles.activeText]}>Income</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedType === "expense" && styles.expenseTab]} onPress={() => setSelectedType("expense")}><Text style={[styles.tabText, selectedType === "expense" && styles.activeText]}>Expense</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedType === "saving" && styles.savingTab]} onPress={() => setSelectedType("saving")}><Text style={[styles.tabText, selectedType === "saving" && styles.activeText]}>Savings</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedType === "total" && styles.totalTab]} onPress={() => setSelectedType("total")}><Text style={[styles.tabText, selectedType === "total" && styles.activeText]}>All</Text></TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="tomato" style={{ marginTop: 20 }} />
      ) : (
       <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => {
            const formattedDate = formatDate(item.createdAt)
            return (
              <Card style={styles.rowCard}>
                <View style={styles.row}>
                  <Image source={item.icon} style={styles.icon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={{ color: "#888", marginTop: 4, fontSize: 12 }}>
                      {formattedDate}
                    </Text>
                  </View>
                  <Text style={{ color: amountColors[item.type || selectedType!] }}>
                    {formatAmount(item.type || selectedType!, item.amount)}
                  </Text>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}