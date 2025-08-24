import React from "react";
import { StyleSheet, View } from "react-native";

export const CardGrid: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
