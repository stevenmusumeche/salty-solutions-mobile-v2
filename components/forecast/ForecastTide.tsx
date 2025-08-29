import { Rect, useFont } from "@shopify/react-native-skia";
import {
  addDays,
  addHours,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import { black, blue, gray } from "../../constants/colors";
import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
} from "../../graphql/generated";
import { buildDatasets, Y_PADDING } from "../../utils/tide-helpers";
import ChartLabelSwatch from "../ChartLabelSwatch";
// @ts-ignore
import inter from "../../assets/fonts/inter-medium.ttf";

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
  const font = useFont(inter, 12);
  const { width } = useWindowDimensions();

  const curDayTideData = useMemo(
    () =>
      rawTideData.filter((x) =>
        isWithinInterval(new Date(x.time), {
          start: addHours(startOfDay(date), -2),
          end: addHours(startOfDay(addDays(date, 1)), 2),
        })
      ),
    [rawTideData, date]
  );

  const curDaySunData: SunDetailFieldsFragment = useMemo(
    () =>
      sunData.filter(
        (x) =>
          startOfDay(new Date(x.sunrise)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || ({} as SunDetailFieldsFragment),
    [sunData, date]
  );

  const curDaySolunarData: SolunarDetailFieldsFragment = useMemo(
    () =>
      solunarData.filter(
        (x) =>
          startOfDay(new Date(x.date)).toISOString() ===
          startOfDay(date).toISOString()
      )[0] || ({} as SolunarDetailFieldsFragment),
    [solunarData, date]
  );

  const yTickVals = useMemo(
    () => [0, 3, 6, 9, 12, 15, 18, 21].map((h) => addHours(date, h)),
    [date]
  );

  const {
    tideData,
    tideBoundaries,
    daylight,
    tidesWithinSolunarPeriod,
    dawn,
    dusk,
  } = useMemo(
    () => buildDatasets(curDaySunData, curDayTideData, curDaySolunarData),
    [curDaySunData, curDayTideData, curDaySolunarData]
  );
  const { min, max } = tideBoundaries;

  const y0 = min < 0 ? min - Y_PADDING : 0;

  // Transform data for Victory Native v41
  const transformedTideData = tideData.map((datum) => ({
    x: datum.x.getTime(),
    y: datum.y,
    type: datum.type,
  }));

  return (
    <View style={styles.container}>
      <View style={{ height: 180, width: width - 20 }}>
        <CartesianChart
          data={transformedTideData}
          xKey="x"
          yKeys={["y"]}
          padding={{ left: 25, top: 20, right: 25, bottom: 30 }}
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
            const chartHeight = chartBounds.bottom - chartBounds.top;
            const chartWidth = chartBounds.right - chartBounds.left;
            const startTime = startOfDay(date).getTime();
            const endTime = endOfDay(date).getTime();
            const timeRange = endTime - startTime;

            // y0 for Area component should be the bottom of the chart in screen coordinates
            const bottomY = chartBounds.bottom;

            return (
              <>
                {/* Night/day backgrounds - render first (fill entire chart) */}
                {/* Full night background */}
                <Rect
                  x={chartBounds.left}
                  y={chartBounds.top}
                  width={chartWidth}
                  height={chartHeight}
                  color={gray[700]}
                />

                {/* Daylight background */}
                {daylight.length > 0 && (
                  <Rect
                    x={
                      chartBounds.left +
                      ((daylight[0].x.getTime() - startTime) / timeRange) *
                        chartWidth
                    }
                    y={chartBounds.top}
                    width={
                      ((daylight[daylight.length - 1].x.getTime() -
                        daylight[0].x.getTime()) /
                        timeRange) *
                      chartWidth
                    }
                    height={chartHeight}
                    color={gray[100]}
                  />
                )}

                {/* Dawn background */}
                {dawn.length > 0 && (
                  <Rect
                    x={
                      chartBounds.left +
                      ((dawn[0].x.getTime() - startTime) / timeRange) *
                        chartWidth
                    }
                    y={chartBounds.top}
                    width={
                      ((dawn[dawn.length - 1].x.getTime() -
                        dawn[0].x.getTime()) /
                        timeRange) *
                      chartWidth
                    }
                    height={chartHeight}
                    color={gray[500]}
                  />
                )}

                {/* Dusk background */}
                {dusk.length > 0 && (
                  <Rect
                    x={
                      chartBounds.left +
                      ((dusk[0].x.getTime() - startTime) / timeRange) *
                        chartWidth
                    }
                    y={chartBounds.top}
                    width={
                      ((dusk[dusk.length - 1].x.getTime() -
                        dusk[0].x.getTime()) /
                        timeRange) *
                      chartWidth
                    }
                    height={chartHeight}
                    color={gray[500]}
                  />
                )}

                {/* Main tide area with blue fill - fills from curve down to bottom */}
                <Area
                  points={points.y}
                  y0={bottomY}
                  color={blue[650]}
                  opacity={1}
                  curveType="natural"
                />

                {/* Tide line stroke for better visibility */}
                <Line
                  points={points.y}
                  color={blue[800]}
                  strokeWidth={2}
                  curveType="natural"
                />

                {/* Solunar feeding period overlays - also fill from curve down to bottom */}
                {tidesWithinSolunarPeriod.map((solunarTides, i) => {
                  if (solunarTides.length === 0) return null;

                  // Filter points that match this solunar period
                  const solunarPoints = points.y.filter((_, index) => {
                    const dataPoint = transformedTideData[index];
                    return solunarTides.some(
                      (tide) => Math.abs(tide.x.getTime() - dataPoint.x) < 60000 // within 1 minute
                    );
                  });

                  if (solunarPoints.length === 0) return null;

                  return (
                    <Area
                      key={i}
                      points={solunarPoints}
                      y0={bottomY}
                      color={"rgba(255,255,255, .25)"}
                      opacity={1}
                      curveType="natural"
                    />
                  );
                })}
              </>
            );
          }}
        </CartesianChart>
      </View>
      <ChartLegend stationName={stationName} />
    </View>
  );
};

export default ForecastTide;

const ChartLegend: React.FC<{ stationName: string }> = ({ stationName }) => {
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
  container: {
    marginHorizontal: 10,
    marginBottom: 0,
    marginTop: 4,
  },
  chartLabelWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  chartLabelInnerWrapper: {
    marginRight: 20,
    marginTop: 5,
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
