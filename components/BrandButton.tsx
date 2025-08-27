import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { blue, gray, white } from "../constants/colors";

interface BrandButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

const BrandButton: React.FC<BrandButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: blue[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderTopWidth: 1,
    borderTopColor: gray[100],
  },
  text: {
    color: white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BrandButton;