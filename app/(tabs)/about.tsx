import DevSettings from "@/components/DevSettings";
import { gray, red, white } from "@/constants/colors";
import { useUserContext } from "@/context/UserContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AboutScreen() {
  const { actions, user } = useUserContext();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Your Account</Text>
        {user.isLoggedIn && (
          <View>
            <Paragraph>You&apos;re logged in as {user.name}!</Paragraph>
            <Paragraph>
              Premium Status: {user.entitledToPremium ? "Active" : "Inactive"}
            </Paragraph>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={actions.logout}
            >
              <Text style={styles.buttonText}>Logout from Salty Solutions</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Development settings - only shows in dev builds */}
      <DevSettings />

      <View style={[styles.section, styles.sectionWithBorder]}>
        <Text style={styles.header}>About</Text>
        <Paragraph>
          Hi, I&apos;m Steven Musumeche, a resident of Lafayette, LA and avid
          saltwater fisherman. I created Salty Solutions to answer a question
          that I&apos;m always asking myself:
        </Paragraph>
        <Text style={[styles.when, styles.paragraph]}>
          WHEN SHOULD I GO FISHING?
        </Text>
        <Paragraph>
          Like most of you, I have a limited amount of time that I can devote to
          fishing. When I plan my next fishing trip, I want to make sure the
          conditions are conducive to a productive day on the water.
        </Paragraph>
        <Paragraph>
          There are lots of great websites and apps available with information
          about weather, tides, and more. However, none of them gave me
          everything that I wanted to know in a way that could be quickly viewed
          and easily digested.
        </Paragraph>
        <Paragraph>
          I&apos;m a software engineer by trade, so I thought, &quot;hey, I can
          make something decent enough for personal use.&quot; After showing it
          to a few fellow fisherman, I decided to release it publically for
          everyone to use.
        </Paragraph>
        <Paragraph>
          I hope you find it useful - please contact me with any suggestions or
          comments.
        </Paragraph>
        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => Linking.openURL("https://salty.solutions/privacy")}
        >
          <Text style={styles.privacyButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>
          App: {Constants.expoConfig?.version || "0"}, Code: 3.0.0
        </Text>
      </View>

      <View style={styles.socialSection}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `mailto:steven@musumeche.com?subject=Salty Solutions ${
                Platform.OS === "ios" ? "iOS" : "Android"
              } App`
            ).catch()
          }
        >
          <MaterialIcons name="email" size={48} color={white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.facebook.com/musumeche")}
        >
          <FontAwesome name="facebook-square" size={48} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://twitter.com/smusumeche")}
        >
          <FontAwesome name="twitter" size={48} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.linkedin.com/in/smusumeche")
          }
        >
          <FontAwesome name="linkedin-square" size={48} color="#0e76a8" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://github.com/stevenmusumeche")}
        >
          <FontAwesome name="github" size={48} color={white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    flexGrow: 1,
  },
  section: {
    padding: 20,
  },
  sectionWithBorder: {
    backgroundColor: gray[100],
    borderTopColor: gray[200],
    borderTopWidth: 1,
    borderBottomColor: gray[200],
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 15,
    // color: white,
    fontWeight: "600",
  },
  when: {
    fontWeight: "500",
    // color: white,
  },
  paragraph: {
    marginBottom: 15,
    // color: gray[300],
    // lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: red["700"],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  privacyButton: {
    backgroundColor: gray[700],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  privacyButtonText: {
    color: white,
    fontSize: 16,
    textAlign: "center",
  },
  versionText: {
    color: gray[500],
    textAlign: "center",
    fontSize: 12,
  },
  socialSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
