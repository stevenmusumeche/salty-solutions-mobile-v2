import { gray, white } from "@/constants/colors";
import { usePurchaseContext } from "@/context/PurchaseContext";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
  children,
}) => {
  const {
    premiumSubscription,
    initiatePurchase,
    purchasing,
    purchaseResultMessage,
  } = usePurchaseContext();

  const buttonSubtitle = premiumSubscription
    ? `${premiumSubscription.displayPrice}/month. Cancel anytime.`
    : "";

  const handlePurchasePress = async () => {
    if (purchasing) {
      console.error(
        "Error in handlePurchasePress - purchase already in progress"
      );
    }
    if (!premiumSubscription) {
      console.error(
        "Error in handlePurchasePress - no premiumSubscription found"
      );
      return;
    }
    await initiatePurchase(premiumSubscription);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: white }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
      <Text>purchaseResultMessage: {purchaseResultMessage}</Text>
      <View style={styles.buttonContainer}>
        <BrandButton
          title={purchasing ? "Processing..." : buttonTitle}
          onPress={handlePurchasePress}
          disabled={purchasing}
        />
        <Text style={styles.buttonSubtitle}>{buttonSubtitle}</Text>
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
