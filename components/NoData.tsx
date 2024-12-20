import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../colors";

const NoData = () => (
  <View style={styles.container}>
    <View style={{ marginBlockEnd: 5 }}>
      <MaterialCommunityIcons
        name="calendar-clock-outline"
        size={60}
        color={gray[500]}
      />
    </View>
    <Text style={styles.text}>No Recent Data Available</Text>
  </View>
);

export default NoData;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 12,
    color: gray[700],
  },
});
