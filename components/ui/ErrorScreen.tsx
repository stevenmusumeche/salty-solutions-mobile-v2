import { gray, red } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface ErrorScreenProps {
  error: string;
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
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
    color: red["700"],
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
