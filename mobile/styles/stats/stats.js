import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16},
  buttonContainer: { flexDirection: "row", justifyContent: "space-between"},
  tab: { flex: 1, marginHorizontal: 4, paddingVertical: 10, backgroundColor: "#eee", borderRadius: 8, alignItems: "center"},
  incomeTab: { backgroundColor: "#2d803bff"},
  expenseTab: { backgroundColor: "tomato"},
  savingTab: { backgroundColor: "#daa757"},
  tabText: { fontWeight: "600", color: "#333",},
  activeText: { color: "#fff"},
  rowCard: { marginBottom: 10, padding: 10, borderRadius: 12, elevation: 2},
  row: { flexDirection: "row", alignItems: "center"},
  icon: { width: 32, height: 32, marginRight: 12},
  title: { flex: 1, fontSize: 16, fontWeight: "500"},
  amount: { fontSize: 16, fontWeight: "bold" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16},
  addButton: { backgroundColor: "pink", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, marginBottom: 16},
});

export default styles;
