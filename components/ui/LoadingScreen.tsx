import { gray, white } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={white} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[700],
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: white,
    fontSize: 16,
    marginTop: 10,
  },
});
