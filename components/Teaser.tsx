import { gray, white } from "@/constants/colors";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BrandButton from "./BrandButton";

interface Props {
  title: string;
  description: string;
  buttonTitle?: string;
  buttonSubtitle?: string;
  children?: React.ReactNode;
}

const Teaser: React.FC<Props> = ({
  title,
  description,
  buttonTitle = "Upgrade to Premium",
  buttonSubtitle = "Only $1.99/month. Cancel anytime.", // TODO: IAP - Replace with dynamic pricing from app store
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
        <BrandButton title={buttonTitle} onPress={handlePurchasePress} />
        {buttonSubtitle && (
          <Text style={styles.buttonSubtitle}>{buttonSubtitle}</Text>
        )}
      </View>
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
  buttonSubtitle: {
    color: gray[700],
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
});
