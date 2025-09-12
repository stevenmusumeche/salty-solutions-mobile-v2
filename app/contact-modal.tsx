import { gray, white } from "@/constants/colors";
import { useUserContext } from "@/context/UserContext";
import { useSendFeedbackMutation } from "@/graphql/generated";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandButton from "../components/BrandButton";

export default function ContactModalScreen() {
  const router = useRouter();
  const { user } = useUserContext();
  const [sendFeedback] = useSendFeedbackMutation();

  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info fields - prefilled from logged-in user
  const [userName, setUserName] = useState(
    "name" in user ? user.name || "" : ""
  );
  const [userEmail, setUserEmail] = useState(
    "email" in user ? user.email || "" : ""
  );

  // Form validation
  const isFormValid = 
    contactSubject.trim() !== "" && 
    contactMessage.trim() !== "" && 
    userName.trim() !== "" && 
    userEmail.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim());

  const handleContactSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build detailed system information
      const userInfo = `User ID: ${"id" in user ? user.id : "Not available"}
Name: ${"name" in user ? user.name || "Not provided" : "Not provided"}
Email: ${"email" in user ? user.email || "Not provided" : "Not provided"}
Premium Status: ${user.entitledToPremium ? "Active" : "Inactive"}`;

      const systemInfo = `
User Message:
${contactMessage.trim()}

--- Contact Information ---
${userInfo}

--- System Information ---
App Version: ${Application.nativeApplicationVersion || "Unknown"}
Build: ${Application.nativeBuildVersion || "Unknown"}
Config Version: ${Constants.expoConfig?.version || "Unknown"}
Platform: ${Platform.OS === "ios" ? "iOS" : "Android"}
OS Version: ${Platform.Version}
Timestamp: ${new Date().toISOString()}`;

      const fromName = "Salty Solutions Mobile User";
      const fromEmail = "email" in user && user.email
        ? user.email
        : "no-reply@salty.solutions";

      await sendFeedback({
        variables: {
          input: {
            fromName,
            fromEmail,
            subject: contactSubject.trim(),
            message: systemInfo,
          },
        },
      });

      Alert.alert(
        "Message Sent",
        "Thank you for your feedback! Your message has been sent successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch {
      Alert.alert(
        "Error",
        "There was an error sending your message. Please try again or contact steven@musumeche.com directly.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Send feedback, report issues, or ask questions
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Name *</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Your full name"
            editable={!isSubmitting}
            placeholderTextColor={gray[600]}
          />

          <Text style={styles.fieldLabel}>Email *</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            placeholderTextColor={gray[600]}
          />

          <Text style={styles.fieldLabel}>Subject *</Text>
          <TextInput
            style={styles.input}
            value={contactSubject}
            onChangeText={setContactSubject}
            placeholder="Briefly describe your issue or question"
            editable={!isSubmitting}
            placeholderTextColor={gray[600]}
          />

          <Text style={styles.fieldLabel}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={contactMessage}
            onChangeText={setContactMessage}
            placeholder="Please provide details about your issue, question, or feedback..."
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
            placeholderTextColor={gray[600]}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <BrandButton
          title={isSubmitting ? "Sending..." : "Send Message"}
          onPress={handleContactSubmit}
          disabled={isSubmitting || !isFormValid}
          style={styles.sendButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  content: {
    flex: 1,
  },
  descriptionSection: {
    padding: 20,
    paddingBottom: 10,
  },
  description: {
    fontSize: 16,
    color: gray[700],
    lineHeight: 22,
    textAlign: "center",
  },
  formSection: {
    paddingHorizontal: 20,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: gray[900],
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: gray[400],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: white,
    color: gray[900],
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    backgroundColor: white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: gray[200],
  },
  sendButton: {
    marginBottom: 0,
  },
});
