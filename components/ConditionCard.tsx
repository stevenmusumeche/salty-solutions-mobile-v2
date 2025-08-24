import { black, gray, white } from "@/constants/colors";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface Props {
  headerText: string;
  children: React.ReactNode;
}

export const ConditionCard: React.FC<Props> = ({ headerText, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{headerText}</Text>
        </View>
        <View style={styles.children}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    padding: 10,
    ...Platform.select({
      ios: {
        width: "50%",
      },
      android: {
        width: "50%",
      },
      web: {
        width: "25%",
        "@media (max-width: 768px)": {
          width: "50%", // 2 cards per row on smaller screens
        },
      },
    }),
  },
  cardWrapper: {
    backgroundColor: white,
    flexGrow: 1,
    flexShrink: 0,
    alignItems: "center",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: black,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  header: {
    backgroundColor: gray[200],
    width: "100%",
    alignItems: "center",
    padding: 8,
    overflow: "hidden",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 12,
  },
  children: {
    width: "100%",
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
});
