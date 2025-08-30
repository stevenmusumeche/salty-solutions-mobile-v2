import { matchFont } from "@shopify/react-native-skia";
import { addHours, endOfDay, format, startOfDay } from "date-fns";
import React, { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import { black, blue } from "../../constants/colors";
import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
} from "../../graphql/generated";
import { prepareTideDataForDay, Y_PADDING } from "../../utils/tide-helpers";
import SolunarFeedingPeriodsOverlay from "./SolunarFeedingPeriodsOverlay";
import TideChartSkyBackground from "./TideChartBackground";
import TideChartLegend from "./TideChartLegend";

const CHART_HEIGHT = 130;
const CHART_PADDING = 20;
const TICK_HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

interface Props {
  stationName: string;
  tideData: TideDetailFieldsFragment[];
  sunData: SunDetailFieldsFragment[];
  date: Date;
  solunarData: SolunarDetailFieldsFragment[];
}

const ForecastTide: React.FC<Props> = ({
  tideData: rawTideData,
  sunData,
  date,
  stationName,
  solunarData,
}) => {
  const fontFamily = Platform.select({
    ios: "Helvetica",
    android: "Roboto",
    default: "sans-serif",
  });
  const font = matchFont({ fontFamily, fontSize: 10 });
  const { width } = useWindowDimensions();

  const yTickVals = useMemo(
    () => TICK_HOURS.map((h) => addHours(date, h)),
    [date]
  );

  const { tideData, tideBoundaries, daylight, solunarPeriods } = useMemo(
    () => prepareTideDataForDay(rawTideData, sunData, solunarData, date),
    [rawTideData, sunData, solunarData, date]
  );
  const { min, max } = tideBoundaries;

  const y0 = min - Y_PADDING > 0 ? 0 : min - Y_PADDING;

  return (
    <View style={styles.container}>
      <View style={{ height: CHART_HEIGHT, width: width - CHART_PADDING }}>
        <CartesianChart
          data={tideData}
          xKey="timestamp"
          yKeys={["waterHeight"]}
          padding={{ left: 0, top: 0, right: 17, bottom: 0 }}
          domain={{
            x: [startOfDay(date).getTime(), endOfDay(date).getTime()],
            y: [y0, max + Y_PADDING],
          }}
          yAxis={[
            {
              font,
              lineWidth: 0,
              formatYLabel: (value) => value.toFixed(1),
            },
          ]}
          xAxis={{
            font,
            lineWidth: 0,
            tickValues: yTickVals.map((date) => date.getTime()),
            formatXLabel: (timestamp) => {
              const d = new Date(timestamp);
              if (d.getHours() === 12) {
                return format(d, "b");
              }
              return format(d, "haaaaa");
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
                {/* Day/night background colors */}
                <TideChartSkyBackground
                  date={date}
                  daylight={daylight}
                  chartBounds={chartBounds}
                />

                {/* Main tide area with blue fill*/}
                <Area
                  points={points.waterHeight}
                  y0={chartBounds.bottom}
                  color={blue[650]}
                  opacity={1}
                  curveType="natural"
                />

                {/* Tide area stroke for better visibility */}
                <Line
                  points={points.waterHeight}
                  color={blue[800]}
                  strokeWidth={1}
                  curveType="natural"
                />

                {/* Solunar feeding period overlays */}
                <SolunarFeedingPeriodsOverlay
                  solunarPeriods={solunarPeriods}
                  waterHeightPoints={points.waterHeight}
                  tideData={tideData}
                  chartBounds={chartBounds}
                />
              </>
            );
          }}
        </CartesianChart>
      </View>
      <TideChartLegend stationName={stationName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingInline: 10,
    paddingTop: 15,
  },
});

export default ForecastTide;
