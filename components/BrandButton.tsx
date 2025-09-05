import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { blue, gray, white } from "../constants/colors";

interface BrandButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  disabled?: boolean;
}

const BrandButton: React.FC<BrandButtonProps> = ({ title, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled, style]} 
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
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
  buttonDisabled: {
    backgroundColor: gray[400],
    borderTopColor: gray[300],
  },
  text: {
    color: white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  textDisabled: {
    color: gray[200],
  },
});

export default BrandButton;