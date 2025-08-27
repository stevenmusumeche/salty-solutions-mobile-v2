import { MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { gray, yellow } from "../../constants/colors";

const Stars: FC<{ score: number; size?: number }> = ({ score, size = 24 }) => (
  <View style={styles.container}>
    {[...new Array(5)].map((e, i) => (
      <MaterialIcons
        key={i}
        name="star"
        size={size}
        color={score > i ? yellow[500] : gray[400]}
      />
    ))}
  </View>
);

export default Stars;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
