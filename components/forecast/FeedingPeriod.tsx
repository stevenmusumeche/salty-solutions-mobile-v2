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
}

/**
 * FeedingPeriod component displays feeding periods (Major or Minor)
 * with start/end times aligned in columns for better readability
 */
const FeedingPeriod: FC<Props> = ({ type, periods }) => (
  <View style={styles.container}>
    {periods.map((period) => (
      // Three-column layout: start time | dash | end time for vertical alignment
      <View key={period.start} style={styles.periodRow}>
        <Text style={[styles.time, styles.startTime, { fontSize: 16 }]}>
          {format(new Date(period.start), "h:mmaaaaa")}
        </Text>
        <Text style={[styles.time, styles.dash, { fontSize: 16 }]}>-</Text>
        <Text style={[styles.time, styles.endTime, { fontSize: 16 }]}>
          {format(new Date(period.end), "h:mmaaaaa")}
        </Text>
      </View>
    ))}
    <Text style={styles.label}>{type} Feeding Periods</Text>
  </View>
);

export default FeedingPeriod;

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    textAlign: "center",
    fontSize: 22,
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
  label: {
    marginTop: 2,
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
  },
});
