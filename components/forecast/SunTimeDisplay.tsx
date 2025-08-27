import { format } from "date-fns";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../../constants/colors";

interface Props {
  /** Label for the sun time (e.g., "sunrise", "nautical dawn") */
  name: string;
  /** Date object containing the time */
  value: Date;
}

/**
 * SunTimeDisplay component displays a single sun time (e.g., sunrise, sunset)
 * with its formatted time, icon, and label
 */
const SunTimeDisplay: FC<Props> = ({ name, value }) => (
  <View style={styles.container}>
    <Text style={styles.time}>{format(value, "h:mm")}</Text>
    <Text style={styles.label}>{name}</Text>
  </View>
);

export default SunTimeDisplay;

const styles = StyleSheet.create({
  container: {
    width: "25%",
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
});
