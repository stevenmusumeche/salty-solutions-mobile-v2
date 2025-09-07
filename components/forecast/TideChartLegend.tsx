import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { black, blue, gray } from "../../constants/colors";
import ChartLabelSwatch from "../ChartLabelSwatch";

interface TideChartLegendProps {
  tideStationName?: string;
  observationStationName?: string;
  showObserved?: boolean;
  onChangePress?: () => void;
  showFeedingPeriods?: boolean;
}

const TideChartLegend: React.FC<TideChartLegendProps> = ({
  tideStationName,
  observationStationName,
  showObserved = true,
  onChangePress,
  showFeedingPeriods = true,
}) => {
  const legendContent = (
    <View
      style={onChangePress ? styles.chartLabelItems : styles.chartLabelWrapper}
    >
      {tideStationName && (
        <View style={styles.chartLabelInnerWrapper}>
          <ChartLabelSwatch color={blue[650]} />
          <Text style={styles.chartLabelText}>Tides for {tideStationName}</Text>
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
        <Text style={styles.chartLabelText}>
          {showFeedingPeriods
            ? "Solunar Feeding Periods"
            : "Feeding Periods (Premium Required)"}
        </Text>
      </View>
    </View>
  );

  if (onChangePress) {
    return (
      <View style={styles.chartLabelWrapper}>
        <View style={styles.legendWithButtonContainer}>
          {legendContent}
          <TouchableOpacity style={styles.changeButton} onPress={onChangePress}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return legendContent;
};

const styles = StyleSheet.create({
  chartLabelWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 5,
    rowGap: 3,
    paddingLeft: 27,
    paddingRight: 20,
  },
  chartLabelItems: {
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 3,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  legendWithButtonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    columnGap: 10,
  },
  chartLabelInnerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  chartLabelText: {
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 11,
    letterSpacing: -0.1,
    flexShrink: 1,
    maxWidth: "90%",
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: gray[100],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gray[300],
    flexGrow: 0,
  },
  changeButtonText: {
    fontSize: 12,
    color: gray[700],
    fontWeight: "500",
  },
});

export default TideChartLegend;
