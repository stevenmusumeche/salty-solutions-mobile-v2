import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { blue, gray } from "../../constants/colors";
import ChartLabelSwatch from "../ChartLabelSwatch";

const WindChartLegend: React.FC = () => {
  return (
    <View style={styles.chartLabelWrapper}>
      <View style={styles.chartLabelInnerWrapper}>
        <ChartLabelSwatch color={blue[700]} />
        <Text style={[styles.chartLabelText, { marginRight: 10 }]}>Wind</Text>
        <ChartLabelSwatch color={blue[700]} opacity={0.3} />
        <Text style={styles.chartLabelText}>Gusts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartLabelWrapper: {
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  chartLabelInnerWrapper: {
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  chartLabelText: {
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
    letterSpacing: -0.3,
  },
});

export default WindChartLegend;