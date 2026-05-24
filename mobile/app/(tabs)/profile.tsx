import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ import AsyncStorage
import styles from "../../styles/home/home.js";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ✅ Clear token
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // ✅ Redirect to login
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome Sarim 🙍🏻‍♂️</Text>
      <Button mode="contained" style={{ marginTop: 30 }} buttonColor="pink" textColor="white" onPress={handleLogout}>Logout</Button>
    </View>
  );
}
