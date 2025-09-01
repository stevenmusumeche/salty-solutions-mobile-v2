import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { black, blue, gray } from "../../constants/colors";
import ChartLabelSwatch from "../ChartLabelSwatch";

interface TideChartLegendProps {
  tideStationName?: string;
  observationStationName?: string;
  showObserved?: boolean;
}

const TideChartLegend: React.FC<TideChartLegendProps> = ({
  tideStationName,
  observationStationName,
  showObserved = true,
}) => {
  return (
    <View style={styles.chartLabelWrapper}>
      {tideStationName && (
        <View style={styles.chartLabelInnerWrapper}>
          <ChartLabelSwatch color={blue[650]} />
          <Text style={styles.chartLabelText}>
            {showObserved && `Tides for ${tideStationName}`}
          </Text>
        </View>
      )}
      {showObserved && observationStationName && (
        <View style={styles.chartLabelInnerWrapper}>
          <ChartLabelSwatch color={black} />
          <Text style={styles.chartLabelText}>
            Observed at {observationStationName}
          </Text>
        </View>
      )}
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
