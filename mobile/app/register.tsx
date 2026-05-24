// Imports.
import { useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/register/register.js";


// Frontend.
export default function Register() {
  // States.
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle register.
  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      if (!name || !email || !password) {
        throw new Error("Please fill all fields");
      }

      const res = await fetch("http://192.168.1.23:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto login after successful registration.
      const loginRes = await fetch("http://192.168.1.23:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        // Save user data in AsyncStorage.
        await AsyncStorage.multiSet([
          ["token", loginData.token],
          ["userId", String(loginData.userId)],
          ["name", loginData.name],
        ]);

        // Redirect to home tabs.
        router.replace("/(tabs)/home");
      } else {
        // If auto-login fails, redirect to login page.
        router.replace("/");
      }
    } catch (err: any) {
      console.error("Register Error:", err.message);
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

        {/* Name. */}
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.dive} value={name} onChangeText={setName} autoCapitalize="words" />

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

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Button. */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>REGISTER</Text>
          )}
        </TouchableOpacity>

        {/* Switch to Login */}
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.switchText}>Already have an account? Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  </KeyboardAvoidingView>
  );
}
