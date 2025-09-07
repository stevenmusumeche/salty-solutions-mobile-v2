import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Teaser from "../components/Teaser";
import FeedingPeriod from "../components/forecast/FeedingPeriod";
import Stars from "../components/forecast/Stars";
import SunTimeDisplay from "../components/forecast/SunTimeDisplay";
import { gray } from "../constants/colors";

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
  return (
    <Teaser
      title="Unlock Peak Fishing Times"
      description="Solunar theory uses moon and sun positions to predict when fish are most active. Premium members get daily solunar scores and precise feeding periods to maximize their fishing success."
    >
      <View style={styles.previewContainer}>
        <View style={styles.starsWrapper}>
          <Stars score={sampleSolunarData.score} isPremium={true} />
          <Text style={styles.solunarScoreLabel}>Solunar Score</Text>
        </View>

        <View style={styles.rowWrapper}>
          <FeedingPeriod
            type="Major"
            periods={sampleSolunarData.majorPeriods}
            isPremium={true}
          />
          <FeedingPeriod
            type="Minor"
            periods={sampleSolunarData.minorPeriods}
            isPremium={true}
          />
        </View>

        <View style={styles.rowWrapper}>
          <SunTimeDisplay
            name="nautical dawn"
            value={new Date(sampleSunData.nauticalDawn)}
          />
          <SunTimeDisplay
            name="sunrise"
            value={new Date(sampleSunData.sunrise)}
          />
          <SunTimeDisplay
            name="sunset"
            value={new Date(sampleSunData.sunset)}
          />
          <SunTimeDisplay
            name="nautical dusk"
            value={new Date(sampleSunData.nauticalDusk)}
          />
        </View>
      </View>
    </Teaser>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    padding: 15,
    backgroundColor: gray[100],
    borderColor: gray[200],
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  starsWrapper: {
    width: "40%",
    alignSelf: "center",
  },
  solunarScoreLabel: {
    marginTop: 2,
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
    letterSpacing: -0.1,
  },
  rowWrapper: {
    flexDirection: "row",
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: gray[900],
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    fontSize: 16,
    lineHeight: 24,
    color: gray[700],
    marginBottom: 4,
  },
});
