/**
 * DevSettings Component
 *
 * Development-only settings panel for testing and debugging the app.
 * This component provides various toggles and overrides that help developers
 * test different app states and features without needing actual data or accounts.
 *
 * IMPORTANT: This component only renders in development builds (__DEV__ === true)
 * and will be completely excluded from production builds.
 *
 * Current Features:
 * - Premium status override: Test premium/free experiences without a subscription
 */

import { gray, yellow } from "@/constants/colors";
import { useUserContext } from "@/context/UserContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DevSettings: React.FC = () => {
  const { user, premiumOverride, actions } = useUserContext();

  // Only render in development builds
  if (!__DEV__) {
    return null;
  }

  // Get premium override state from UserContext (single source of truth)
  const getPremiumOverrideState = (): "server" | "free" | "premium" => {
    if (premiumOverride === null || premiumOverride === undefined) {
      return "server";
    } else if (premiumOverride === true) {
      return "premium";
    } else {
      return "free";
    }
  };

  const overrideState = getPremiumOverrideState();

  // Handle premium override selection
  const handlePremiumOverride = (option: "server" | "free" | "premium") => {
    switch (option) {
      case "server":
        actions.setPremiumOverride(null);
        break;
      case "free":
        actions.setPremiumOverride(false);
        break;
      case "premium":
        actions.setPremiumOverride(true);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚧 Development Settings</Text>

      {/* Premium Override Section */}
      <Text style={styles.sectionHeader}>Premium Features</Text>
      <Text style={styles.sectionDescription}>
        Override premium status for testing different user experiences.
      </Text>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segment,
            styles.segmentLeft,
            overrideState === "server" && styles.segmentSelected,
          ]}
          onPress={() => handlePremiumOverride("server")}
        >
          <Text
            style={[
              styles.segmentText,
              overrideState === "server" && styles.segmentTextSelected,
            ]}
          >
            Default
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segment,
            styles.segmentMiddle,
            overrideState === "free" && styles.segmentSelected,
          ]}
          onPress={() => handlePremiumOverride("free")}
        >
          <Text
            style={[
              styles.segmentText,
              overrideState === "free" && styles.segmentTextSelected,
            ]}
          >
            Free
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segment,
            styles.segmentRight,
            overrideState === "premium" && styles.segmentSelected,
          ]}
          onPress={() => handlePremiumOverride("premium")}
        >
          <Text
            style={[
              styles.segmentText,
              overrideState === "premium" && styles.segmentTextSelected,
            ]}
          >
            Premium
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Display */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>
            Using Value:{" "}
            <Text style={styles.statusValue}>
              {overrideState === "server"
                ? "Server"
                : overrideState === "premium"
                ? "Premium"
                : "Free"}
            </Text>
          </Text>
        </View>

        {user.isLoggedIn && "serverEntitledToPremium" in user && (
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>
              Server Says:{" "}
              <Text style={styles.statusValue}>
                {user.serverEntitledToPremium ? "Premium" : "Free"}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: yellow["100"],
    borderColor: yellow["400"],
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 0,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: yellow["900"],
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: yellow["900"],
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 12,
    color: yellow["900"],
    lineHeight: 18,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentLeft: {
    marginRight: 1,
  },
  segmentMiddle: {
    marginHorizontal: 1,
  },
  segmentRight: {
    marginLeft: 1,
  },
  segmentSelected: {
    backgroundColor: yellow["900"],
    shadowColor: yellow["900"],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: gray["700"],
  },
  segmentTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    flex: 1,
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: gray["700"],
  },
  statusValue: {
    fontSize: 13,
    color: gray["700"],
    fontWeight: "400",
  },
});

export default DevSettings;
