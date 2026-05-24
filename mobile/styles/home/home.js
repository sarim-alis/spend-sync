import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, marginTop: 1, },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 20 },
  iconLogout: {position: "absolute", top: 0, right: 8, zIndex: 1},
  card: { borderRadius: 12, overflow: "hidden", marginBottom: 16, height: 180, width: "100%", backgroundColor: "#2d803bff" },
  cards: { borderRadius: 12, overflow: "hidden", marginBottom: 16, height: 180, width: "100%", backgroundColor: "tomato"},
  cardss: { borderRadius: 12, overflow: "hidden", marginBottom: 16, height: 180, width: "100%", backgroundColor: "#daa757"},
  cardBg: { flex: 1, justifyContent: "center", height: 180, marginLeft: 170 },
  textOverlay: { padding: 16, alignItems: "flex-start"},
  cardText: { color: "black"},
  cardContent: { flexDirection: "row", alignItems: "center", height: "100%"},
  leftContent: { flex: 1, justifyContent: "center",},
  rightContent: { flex: 1, height: "100%",},
  cardTitle: { color: "#fff", fontSize: 18, marginBottom: 10, marginTop: -20, marginLeft: 12,},
  cardTitles: { color: "#fff", fontSize: 18, marginBottom: 10, marginTop: -20, marginLeft: 12,},
  amount: { color: "#fff", fontSize: 34, fontWeight: "bold", marginLeft: 12, marginBottom: -8,},
  amounts: { color: "#fff", fontSize: 34, fontWeight: "bold", marginLeft: 12, marginBottom: -8,},
  cardImage: { width: "100%",  height: "100%", resizeMode: "cover"},
  cardImages: { width: "100%",  height: "100%", resizeMode: "cover"}
});

export default styles;