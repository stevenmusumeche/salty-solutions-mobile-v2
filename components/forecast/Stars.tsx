import { MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Image, StyleSheet, View } from "react-native";
import { gray, yellow } from "../../constants/colors";

const Stars: FC<{ score: number; size?: number; isPremium: boolean }> = ({
  score,
  size = 24,
  isPremium,
}) => {
  if (!isPremium) {
    return (
      <View style={styles.blurContainer}>
        <Image
          source={require("../../assets/images/stars-blur.png")}
          style={styles.blurImage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {[...new Array(5)].map((_, i) => (
        <MaterialIcons
          key={i}
          name="star"
          size={size}
          color={score > i ? yellow[500] : gray[400]}
        />
      ))}
    </View>
  );
};

export default Stars;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  blurContainer: {
    alignItems: "center",
    backgroundColor: "red",
  },
  blurImage: {
    width: 180,
    height: 42,
  },
});
