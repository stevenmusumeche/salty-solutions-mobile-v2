import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { gray, white } from "@/constants/colors";
import { useUserContext } from "@/context/UserContext";

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const { actions } = useUserContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width, height: width / 5.21 }}
          resizeMode="stretch"
        />
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={actions.login}>
            <Text style={styles.buttonText}>Sign In Free</Text>
          </TouchableOpacity>
          <View style={styles.copyWrapper}>
            <Text style={styles.copyText}>
              Secure login powered by Auth0. Your data stays private and is
              never shared.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[700],
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: gray[900],
    paddingVertical: 20,
    paddingHorizontal: 45,
    borderRadius: 15,
    elevation: 3,
  },
  buttonText: {
    color: white,
    textAlign: "center",
    fontSize: 20,
  },
  copyWrapper: {
    marginTop: 10,
    paddingHorizontal: 70,
  },
  copyText: {
    color: gray[200],
    textAlign: "center",
  },
});
