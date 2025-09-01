import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { blue, white } from "../constants/colors";

interface PillProps {
  label: string;
  color?: string;
  children: React.ReactNode;
}

const Pill: React.FC<PillProps> = ({ label, children, color = blue[600] }) => {
  return (
    <View
      style={[styles.container, { borderColor: color, backgroundColor: color }]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.value}>{children}</View>
    </View>
  );
};

export default Pill;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 6,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "stretch",
  },
  label: {
    width: "50%",
    textAlign: "center",
    alignSelf: "center",
    color: white,
    paddingVertical: 5,
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  value: {
    paddingVertical: 5,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: white,
  },
});
