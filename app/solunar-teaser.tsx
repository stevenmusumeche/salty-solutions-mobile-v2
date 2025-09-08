import React from "react";
import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import Teaser from "../components/Teaser";

const sampleSolunarData = {
  score: 4,
  majorPeriods: [
    { start: "2024-01-01T11:19:00Z", end: "2024-01-01T13:19:00Z", weight: 100 },
    { start: "2023-12-31T22:48:00Z", end: "2024-01-01T00:48:00Z", weight: 100 },
  ],
  minorPeriods: [
    { start: "2024-01-01T12:43:00Z", end: "2024-01-01T13:43:00Z", weight: 100 },
    { start: "2024-01-01T22:51:00Z", end: "2024-01-01T23:51:00Z", weight: 100 },
  ],
};

const sampleSunData = {
  nauticalDawn: "2024-01-01T00:23:00Z",
  sunrise: "2024-01-01T01:04:00Z",
  sunset: "2024-01-01T12:36:00Z",
  nauticalDusk: "2024-01-01T13:49:00Z",
};

export default function SolunarTeaserScreen() {
  const { height } = useWindowDimensions();

  return (
    <Teaser
      title="Unlock Peak Fishing Times"
      description="Solunar theory uses moon and sun positions to predict when fish are most active. Premium members get daily solunar scores and precise feeding periods to maximize their fishing success."
    >
      <View style={[styles.container, { height: height - 470 }]}>
        <Image
          source={require("../assets/images/feeding-phone.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Teaser>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 25,
  },
  image: {
    height: "100%",
  },
});
