import { matchFont } from "@shopify/react-native-skia";
import { addHours, format } from "date-fns";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { CartesianChart, StackedBar } from "victory-native";
import { black, blue, gray } from "../../constants/colors";
import { CombinedForecastV2DetailFragment } from "../../graphql/generated";
import { prepareForecastData } from "../../utils/forecast-helpers";
import WindChartLegend from "./WindChartLegend";
import WindCompassArrows from "./WindCompassArrows";
import WindRainDrops from "./WindRainDrops";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

// Minimum Y-axis range to ensure chart remains readable even with low wind speeds
// and provides adequate space for wind arrows and rain drops
const MIN_Y_AXIS_RANGE = 22;

const ForecastWindChart: React.FC<Props> = ({ data, date }) => {
  const fontFamily = Platform.select({
    ios: "Helvetica",
    android: "Roboto",
    default: "sans-serif",
  });
  const font = matchFont({ fontFamily, fontSize: 10 });
  const { width } = useWindowDimensions();
  const { chartData } = useMemo(
    () => prepareForecastData(data, date),
    [data, date]
  );
  const hasAnyData = useMemo(
    () => !(chartData.find((x) => x.y !== undefined) === undefined),
    [chartData]
  );
  const yTickVals = useMemo(
    () => [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => addHours(date, h)),
    [date]
  );

  if (!hasAnyData) {
    return <EmptyChart />;
  }

  const maxWindSpeedForDay = Math.max(
    ...chartData.map((datum) => datum.gustY + datum.y)
  );

  const transformedData = chartData.map((datum) => {
    return {
      x: datum.x.getTime(),
      windBase: datum.y, // base wind speed
      windGusts: datum.gustY, // additional gust speed on top of base
      totalWind: datum.y + datum.gustY,
      directionDegrees: datum.directionDegrees,
      rain: datum.rain || 0,
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ height: 180, width: width - 20 }}>
        <CartesianChart
          data={transformedData}
          xKey="x"
          yKeys={["windBase", "windGusts", "directionDegrees"]}
          padding={{ left: 0, top: 0, right: 10, bottom: 0 }}
          domainPadding={{ left: 6, right: 6, top: 10, bottom: 0 }}
          domain={{
            x: [date.getTime(), addHours(date, 23).getTime()],
            y: [0, Math.max(maxWindSpeedForDay, MIN_Y_AXIS_RANGE)],
          }}
          yAxis={[
            {
              font,
              lineWidth: 0,
              formatYLabel: (value) => value.toFixed(0),
            },
          ]}
          xAxis={{
            font,
            lineWidth: 0,
            tickValues: yTickVals.map((date) => date.getTime()),
            formatXLabel: (timestamp) => {
              const date = new Date(timestamp);
              if (date.getHours() === 12) {
                return format(date, "b");
              }
              return format(date, "haaaaa");
            },
          }}
          frame={{
            lineWidth: { left: 1, bottom: 1, right: 0, top: 0 },
            lineColor: black,
          }}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <StackedBar
                  points={[points.windBase, points.windGusts]}
                  chartBounds={chartBounds}
                  colors={[blue[700], `${blue[700]}4D`]}
                  innerPadding={0.2}
                />
                <WindCompassArrows
                  windBasePoints={points.windBase}
                  directionPoints={points["directionDegrees"]}
                />
                <WindRainDrops
                  windBasePoints={points.windBase}
                  transformedData={transformedData}
                  chartBounds={chartBounds}
                  maxWindSpeedForDay={maxWindSpeedForDay}
                  minYAxisRange={MIN_Y_AXIS_RANGE}
                />
              </>
            );
          }}
        </CartesianChart>
      </View>
      <WindChartLegend />
    </View>
  );
};

export default ForecastWindChart;

const EmptyChart: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.placeholderText}>No wind data available</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingInline: 10,
    paddingTop: 20,
  },
  emptyState: {
    paddingTop: 10,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: gray[600],
  },
});
