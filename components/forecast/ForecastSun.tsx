import { startOfDay } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../../constants/colors";
import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
} from "../../graphql/generated";
import FeedingPeriod from "./FeedingPeriod";
import Stars from "./Stars";
import SunTimeDisplay from "./SunTimeDisplay";

interface Props {
  /** Array of sun data for multiple days */
  sunData: SunDetailFieldsFragment[];
  /** The specific date to display sun/solunar data for */
  date: Date;
  /** Array of solunar data for multiple days */
  solunarData: SolunarDetailFieldsFragment[];
}

/**
 * ForecastSun component displays sun times, solunar feeding periods, and solunar score
 * for fishing conditions. Shows nautical dawn/dusk, sunrise/sunset times, major/minor
 * feeding periods, and a star-based solunar score rating.
 */
const ForecastSun: React.FC<Props> = ({ sunData, date, solunarData }) => {
  // Filter sun data to find the entry matching the selected date
  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [sunData, date]
  );

  // Filter solunar data to find the entry matching the selected date
  const curDaySolunarData: SolunarDetailFieldsFragment = useMemo(
    () =>
      solunarData.filter(
        (x) =>
          startOfDay(new Date(x.date)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || {},
    [solunarData, date]
  );

  return (
    <View style={styles.container}>
      {/* Sun times row: nautical dawn, sunrise, sunset, nautical dusk */}
      <View style={styles.rowWrapper}>
        <SunTimeDisplay
          name="nautical dawn"
          value={new Date(curDaySunData.nauticalDawn)}
        />
        <SunTimeDisplay
          name="sunrise"
          value={new Date(curDaySunData.sunrise)}
        />
        <SunTimeDisplay name="sunset" value={new Date(curDaySunData.sunset)} />
        <SunTimeDisplay
          name="nautical dusk"
          value={new Date(curDaySunData.nauticalDusk)}
        />
      </View>
      {/* Solunar feeding periods row: Major and Minor periods */}
      <View style={styles.rowWrapper}>
        <FeedingPeriod type="Major" periods={curDaySolunarData.majorPeriods} />
        <FeedingPeriod type="Minor" periods={curDaySolunarData.minorPeriods} />
      </View>
      {/* Solunar score with star rating */}
      <View style={styles.starsWrapper}>
        <Stars score={curDaySolunarData.score} />
        <Text style={[styles.solunarScoreLabel]}>Solunar Score</Text>
      </View>
    </View>
  );
};

export default ForecastSun;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 15,
    backgroundColor: gray[100],
    borderColor: gray[200],
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  rowWrapper: {
    flexDirection: "row",
  },
  starsWrapper: {
    width: "40%",
    marginTop: 20,
    alignSelf: "center",
  },
  solunarScoreLabel: {
    marginTop: 2,
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 12,
  },
});
