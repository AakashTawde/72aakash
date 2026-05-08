import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/auth/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VoIP CRM</Text>
        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutTxt}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        <Text style={styles.role}>{user?.role}</Text>
        <Text style={styles.body}>
          Phase 1 (auth + roles) is live. Coming next:
        </Text>
        <Text style={styles.bullet}>• Phase 2 — Lead management</Text>
        <Text style={styles.bullet}>• Phase 3 — Calling MVP (Exotel)</Text>
        <Text style={styles.bullet}>• Phase 4 — Call logs + recordings</Text>
        <Text style={styles.bullet}>• Phase 5 — Reminders & follow-ups</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "600", color: "#0f172a" },
  logoutBtn: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutTxt: { color: "#fff", fontWeight: "500", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  welcome: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  role: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    fontSize: 12,
  },
  body: { marginTop: 12, color: "#475569", fontSize: 14 },
  bullet: { marginTop: 6, color: "#334155", fontSize: 14 },
});
