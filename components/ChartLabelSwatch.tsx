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
    height: 15,
    width: 15,
    borderRadius: 15,
    marginRight: 5,
  },
});

export default ChartLabelSwatch;
