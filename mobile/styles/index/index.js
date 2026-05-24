import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f9fc", justifyContent: "center", alignItems: "center"},
  card: { width: "85%", backgroundColor: "#fff", padding: 30, borderRadius: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 10, elevation: 4},
  logo: { width: 80, height: 80, marginBottom: 20},
  slogan: { alignSelf: "center", marginBottom: 5, marginTop: 10, fontSize: 24, fontWeight: "bold", color: "pink"},
  label: { alignSelf: "flex-start", marginBottom: 5, marginTop: 10, fontSize: 14, fontWeight: "500", color: "#333"},
  inputWrapper: { width: "100%", position: "relative", marginBottom: 15},
  eyeIcon: { position: "absolute", right: 20, top: "50%", transform: [{ translateY: -20 }], zIndex: 1},
  dive: { width: "100%", borderWidth: 1, borderColor: "#ddd", backgroundColor: "#ffffff", borderRadius: 30, paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, marginBottom: 15, fontSize: 14, color: "#000", textAlignVertical: "center"},
  button: { backgroundColor: "pink", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginTop: 10, width: "100%", alignItems: "center"},
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16},
  switchText: { marginTop: 20, fontSize: 14, color: "#333", fontWeight: "600"},
});

