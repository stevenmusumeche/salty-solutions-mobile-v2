import React from "react";
import {
  Text,
  StyleSheet,
  Button,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { white, gray } from "@/constants/colors";

interface Props {
  title: string;
  description: string;
  buttonTitle?: string;
  children?: React.ReactNode;
}

const Teaser: React.FC<Props> = ({
  title,
  description,
  buttonTitle = "Get Premium Access",
  children,
}) => {

  // TODO: IAP - Implement actual purchase flow when IAP is ready
  const handlePurchasePress = () => {
    Alert.alert(
      "Coming Soon",
      "Premium features will be available for purchase soon!",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: white }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
      <View style={styles.buttonContainer}>
        <Button onPress={handlePurchasePress} title={buttonTitle} />
      </View>
      <Text style={styles.subtitle}>
        Premium subscription coming soon. Enjoy unlimited access to all features.
      </Text>
    </ScrollView>
  );
};

export default Teaser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: gray[700],
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});