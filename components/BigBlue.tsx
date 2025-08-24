import React from "react";
import { StyleSheet, Text } from "react-native";
import { blue } from "../constants/colors";

const BigBlue: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <Text style={styles.container}>{children}</Text>;

export default BigBlue;

const styles = StyleSheet.create({
  container: {
    color: blue[800],
    fontSize: 60,
  },
});
