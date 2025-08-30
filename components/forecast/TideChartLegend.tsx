import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { blue, gray } from "../../constants/colors";
import ChartLabelSwatch from "../ChartLabelSwatch";

interface TideChartLegendProps {
  stationName: string;
}

const TideChartLegend: React.FC<TideChartLegendProps> = ({ stationName }) => {
  return (
    <View style={styles.chartLabelWrapper}>
      <View style={styles.chartLabelInnerWrapper}>
        <ChartLabelSwatch color={blue[650]} />
        <Text style={styles.chartLabelText}>Tides for {stationName}</Text>
      </View>
      <View style={styles.chartLabelInnerWrapper}>
        <ChartLabelSwatch color={blue.solunar} />
        <Text style={styles.chartLabelText}>Solunar Feeding Periods</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartLabelWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 5,
  },
  chartLabelInnerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  chartLabelText: {
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
    letterSpacing: -0.1,
  },
});

export default TideChartLegend;