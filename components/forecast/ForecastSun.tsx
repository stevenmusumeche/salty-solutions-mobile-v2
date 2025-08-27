import { format, startOfDay } from "date-fns";
import React, { FC, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../../constants/colors";
import {
  SolunarDetailFieldsFragment,
  SolunarPeriodFieldsFragment,
  SunDetailFieldsFragment,
} from "../../graphql/generated";
import Stars from "../Stars";

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
        <SunDay
          name="nautical dawn"
          value={new Date(curDaySunData.nauticalDawn)}
        />
        <SunDay name="sunrise" value={new Date(curDaySunData.sunrise)} />
        <SunDay name="sunset" value={new Date(curDaySunData.sunset)} />
        <SunDay
          name="nautical dusk"
          value={new Date(curDaySunData.nauticalDusk)}
        />
      </View>
      {/* Solunar feeding periods row: Major and Minor periods */}
      <View style={styles.rowWrapper}>
        <SolunarPeriod type="Major" periods={curDaySolunarData.majorPeriods} />
        <SolunarPeriod type="Minor" periods={curDaySolunarData.minorPeriods} />
      </View>
      {/* Solunar score with star rating */}
      <View style={styles.starsWrapper}>
        <Stars score={curDaySolunarData.score} />
        <Text style={[sunDayStyles.label, { fontSize: 12 }]}>
          Solunar Score
        </Text>
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
});

/**
 * SunDay component displays a single sun time (e.g., sunrise, sunset)
 * with its formatted time and label
 *
 * @param name - Label for the sun time (e.g., "sunrise", "nautical dawn")
 * @param value - Date object containing the time
 */
const SunDay: FC<{ name: string; value: Date }> = ({ name, value }) => (
  <View style={sunDayStyles.container}>
    <Text style={sunDayStyles.time}>{format(value, "h:mm")}</Text>
    <Text style={sunDayStyles.label}>{name}</Text>
  </View>
);

const sunDayStyles = StyleSheet.create({
  container: {
    width: "25%",
  },
  solunarContainer: {
    width: "50%",
    marginTop: 20,
  },
  time: {
    textAlign: "center",
    fontSize: 22,
  },
  label: {
    marginTop: 2,
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  startTime: {
    flex: 1,
    textAlign: "right",
  },
  dash: {
    width: 20,
    textAlign: "center",
  },
  endTime: {
    flex: 1,
    textAlign: "left",
  },
});

/**
 * SolunarPeriod component displays feeding periods (Major or Minor)
 * with start/end times aligned in columns for better readability
 *
 * @param type - Type of feeding period ("Major" or "Minor")
 * @param periods - Array of period objects with start/end times
 */
const SolunarPeriod: FC<{
  type: "Major" | "Minor";
  periods: SolunarPeriodFieldsFragment[];
}> = ({ type, periods }) => (
  <View style={sunDayStyles.solunarContainer}>
    {periods.map((period) => (
      // Three-column layout: start time | dash | end time for vertical alignment
      <View key={period.start} style={sunDayStyles.periodRow}>
        <Text
          style={[sunDayStyles.time, sunDayStyles.startTime, { fontSize: 16 }]}
        >
          {format(new Date(period.start), "h:mmaaaaa")}
        </Text>
        <Text style={[sunDayStyles.time, sunDayStyles.dash, { fontSize: 16 }]}>
          -
        </Text>
        <Text
          style={[sunDayStyles.time, sunDayStyles.endTime, { fontSize: 16 }]}
        >
          {format(new Date(period.end), "h:mmaaaaa")}
        </Text>
      </View>
    ))}

    <Text style={sunDayStyles.label}>{type} Feeding Periods</Text>
  </View>
);
