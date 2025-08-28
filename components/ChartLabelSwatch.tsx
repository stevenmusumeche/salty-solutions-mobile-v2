import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  color: string;
  opacity?: number;
}

const ChartLabelSwatch: React.FC<Props> = ({ color, opacity = 1 }) => (
  <View
    style={[
      styles.chartLabelSwatch,
      {
        backgroundColor: color,
        opacity,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  chartLabelSwatch: {
    height: 12,
    width: 12,
    borderRadius: 12,
    marginRight: 3,
  },
});

export default ChartLabelSwatch;
