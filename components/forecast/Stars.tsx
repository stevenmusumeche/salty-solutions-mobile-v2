import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { gray, yellow } from "../../constants/colors";

const Stars: FC<{ score: number; size?: number; isPremium: boolean }> = ({
  score,
  size = 24,
  isPremium,
}) => {
  const fakeScore = 3;
  const scoreToUse = isPremium ? score : fakeScore;

  const starsContent = (
    <View style={styles.container}>
      {[...new Array(5)].map((_, i) => (
        <MaterialIcons
          key={i}
          name="star"
          size={size}
          color={scoreToUse > i ? yellow[500] : gray[400]}
        />
      ))}
    </View>
  );

  if (!isPremium) {
    return (
      <BlurView style={styles.blurContainer} blurType="light" blurAmount={5}>
        {starsContent}
      </BlurView>
    );
  }

  return starsContent;
};

export default Stars;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  blurContainer: {
    overflow: "hidden",
    padding: 5,
  },
});
