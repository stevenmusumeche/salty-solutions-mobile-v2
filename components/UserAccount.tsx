import { gray } from "@/constants/colors";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserAccount() {
  const { actions, user } = useUserContext();
  const router = useRouter();

  if (!user.isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Account</Text>
      <View style={styles.userCard}>
        <View style={styles.userInfoTable}>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          {"email" in user && user.email && (
            <View style={styles.tableRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
          )}
          {"createdAt" in user && (
            <View style={styles.tableRow}>
              <Text style={styles.label}>Member since:</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          <View style={styles.tableRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>
              {user.entitledToPremium ? "Premium Active" : "Free Plan"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={actions.logout}>
        <Text style={styles.buttonText}>Logout from Salty Solutions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contactLink}
        onPress={() => router.push("/contact-modal")}
      >
        <Text style={styles.contactLinkText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "600",
  },
  userCard: {
    marginBottom: 15,
  },
  userInfoTable: {
    gap: 6,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: gray[600],
    width: 120,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: gray[900],
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  contactLink: {
    marginTop: 15,
    alignSelf: "center",
    padding: 10,
  },
  contactLinkText: {
    color: gray[600],
    fontSize: 16,
    textAlign: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
