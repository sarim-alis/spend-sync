// Imports.
import { useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/index/index.js";


// Frontend.
export default function Index() {
  // States.
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login.
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://192.168.1.23:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save user data in AsyncStorage.
      await AsyncStorage.multiSet([
        ["token", data.token],
        ["userId", String(data.userId)],
        ["name", data.name],
      ]);

      // Redirect to home tabs.
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error("Login Error:", err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    {/* Container */}
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        {/* Image */}
        <Image style={styles.logo} source={require("../assets/images/logo.png")} resizeMode="contain" />
        <Text style={styles.slogan}>Spend Sync</Text>

        {/* Email. */}
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.dive} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        {/* Password. */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
        <TextInput style={styles.dive} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} />
        </TouchableOpacity>
      </View>

        {/* Button. */}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  </KeyboardAvoidingView>
  );
}
