import { format } from "date-fns";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../../constants/colors";
import { SolunarPeriodFieldsFragment } from "../../graphql/generated";

interface Props {
  /** Type of feeding period ("Major" or "Minor") */
  type: "Major" | "Minor";
  /** Array of period objects with start/end times */
  periods: SolunarPeriodFieldsFragment[];
  /** Whether the user has premium access */
  isPremium: boolean;
}

/**
 * FeedingPeriod component displays feeding periods (Major or Minor)
 * with start/end times aligned in columns for better readability
 */
const FeedingPeriod: FC<Props> = ({ type, periods, isPremium }) => (
  <View style={styles.container}>
    <View style={styles.timesContainer}>
      {periods.map((period) => (
        // Three-column layout: start time | dash | end time for vertical alignment
        <View key={period.start} style={styles.periodRow}>
          <View style={styles.startTime}>
            <Text
              style={[
                styles.time,
                { fontSize: 16 },
                !isPremium && styles.blurredText,
              ]}
            >
              {" "}
              {format(new Date(period.start), "h:mmaaaaa")}{" "}
            </Text>
          </View>
          <View style={styles.dash}>
            <Text
              style={[
                styles.time,
                { fontSize: 16 },
                !isPremium && styles.blurredText,
              ]}
            >
              {" "}
              -{" "}
            </Text>
          </View>
          <View style={styles.endTime}>
            <Text
              style={[
                styles.time,
                { fontSize: 16 },
                !isPremium && styles.blurredText,
              ]}
            >
              {" "}
              {format(new Date(period.end), "h:mmaaaaa")}{" "}
            </Text>
          </View>
        </View>
      ))}
    </View>
    <Text style={styles.label}>{type} Feeding Periods</Text>
  </View>
);

export default FeedingPeriod;

const styles = StyleSheet.create({
  container: {
    width: "50%",
    overflow: "visible",
  },
  timesContainer: {
    position: "relative",
    overflow: "visible",
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "visible",
  },
  time: {
    textAlign: "center",
    fontSize: 22,
  },
  startTime: {
    flex: 1,
    alignItems: "flex-end",
  },
  dash: {
    width: 10,
    alignItems: "center",
  },
  endTime: {
    flex: 1,
    alignItems: "flex-start",
  },
  label: {
    marginTop: 2,
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
  },
  blurredText: {
    color: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingBlock: 2,
  },
});
