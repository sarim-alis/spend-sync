//@ts-nocheck.
// Imports.
import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, RadioButton } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/ip.js";
import styles from "../../styles/create/create.js";

// Frontend.
export default function CreateTransaction() {
  const router = useRouter();

  // States.
  const [transactionType, setTransactionType] = useState<"income" | "expense" | "saving">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Categories.
  const incomeCategories = ["Salary", "Freelance", "Bonus", "Other"];
  const expenseCategories = ["Food", "Rent", "Transport", "Shopping", "Bills"];
  const savingGoals = ["Emergency Fund", "Travel", "Retirement", "Investment"];

  // Handle submit.
  const handleSubmit = async () => {
    const amountValue = parseFloat(amount) || 0;
    if (amountValue <= 0) {
      Alert.alert("Validation Error", "Amount must be greater than 0");
      return;
    }

    if (!category) {
      Alert.alert("Validation Error", "Please select a category or goal");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    let endpoint = "";
    let body: any = { userId, amount: amountValue };

    if (transactionType === "income") {
      endpoint = "incomes";
      body.source = category;
    } else if (transactionType === "expense") {
      endpoint = "expenses";
      body.category = category;
    } else {
      endpoint = "savings";
      body.goal = category;
    }

    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      Alert.alert("Success", `${transactionType} added successfully!`);
      setAmount("");
      setCategory("");
      setTransactionType("income");

      router.push("/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Pick correct options list.
  const options =
    transactionType === "income"
      ? incomeCategories
      : transactionType === "expense"
      ? expenseCategories
      : savingGoals;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Create Transaction 💸💰
      </Text>

      {/* Type */}
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Select Type:</Text>
      <RadioButton.Group onValueChange={(val) => setTransactionType(val as any)} value={transactionType}>
        <RadioButton.Item label="Income" value="income"  color="pink"/>
        <RadioButton.Item label="Expense" value="expense" color="pink"/>
        <RadioButton.Item label="Saving" value="saving" color="pink"/>
      </RadioButton.Group>

      {/* Amount */}
      <TextInput label="Amount" mode="outlined" keyboardType="numeric" value={amount} onChangeText={setAmount} style={{ marginBottom: 12 }} activeOutlineColor="pink" outlineColor="#ccc" />

      {/* Category */}
      <RNPickerSelect onValueChange={(value) => setCategory(value)} items={options.map((opt) => ({ label: opt, value: opt }))} placeholder={{ label: "Select option...", value: "" }} value={category} style={{ inputAndroid: { fontSize: 16, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, marginBottom: 12 }, inputIOS: { fontSize: 16, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, marginBottom: 12 }}}/>

      {/* Submit */}
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} buttonColor="pink" style={{ marginTop: 16 }}>Save Transaction</Button>
    </ScrollView>
  );
}
