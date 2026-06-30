// mobile/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useState } from "react";

export default function TabLayout() {
  const [darkMode, setDarkMode] = useState(false);

  // Custom header for all screens
  const CustomHeader = ({ title = "" }) => {
    return (
      <View style={[styles.header, { backgroundColor: darkMode ? "#222" : "#fff" }]}>
        {/* Drawer Icon */}
        <TouchableOpacity onPress={() => console.log("Open Drawer")}>
          <FontAwesome5 name="bars" size={24} color={darkMode ? "#fff" : "#999"} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.headerTitle, { color: darkMode ? "#fff" : "#000" }]}>
          {title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Theme Toggle Icon */}
          <TouchableOpacity onPress={() => setDarkMode(!darkMode)} style={{ marginRight: 16 }}>
            <FontAwesome5
              name={darkMode ? "moon" : "sun"}
              size={24}
              color={darkMode ? "#fff" : "#999"}
            />
          </TouchableOpacity>
          {/* Notification Icon */}
          <TouchableOpacity onPress={() => console.log("Open Notifications")}>
            <FontAwesome5 name="bell" size={24} color={darkMode ? "#fff" : "#999"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />, // use custom header on all tabs
        tabBarActiveTintColor: "pink",
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarButton: ({ onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={styles.plusButton}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dollar-sign" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 20,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // lifts the button above the tab bar
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5, // for Android shadow
  },
  header: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
