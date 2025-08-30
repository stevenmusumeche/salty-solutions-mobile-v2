import { matchFont, Path, Rect } from "@shopify/react-native-skia";
import {
  addDays,
  addHours,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import { black, blue, gray } from "../../constants/colors";
import {
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
} from "../../graphql/generated";
import { buildDatasets, Y_PADDING } from "../../utils/tide-helpers";
import ChartLabelSwatch from "../ChartLabelSwatch";

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

  // Helper to determine if a solunar period is major or minor
  const isMajorPeriod = useMemo(() => {
    if (!curDaySolunarData.majorPeriods || !curDaySolunarData.minorPeriods) {
      return tidesWithinSolunarPeriod.map(() => false);
    }

    // The buildDatasets function creates the array as [...majorPeriods, ...minorPeriods]
    const majorCount = curDaySolunarData.majorPeriods.length;

    return tidesWithinSolunarPeriod.map((_, index) => {
      // If index is less than majorCount, it's a major period
      return index < majorCount;
    });
  }, [
    tidesWithinSolunarPeriod,
    curDaySolunarData.majorPeriods,
    curDaySolunarData.minorPeriods,
  ]);
  const { min, max } = tideBoundaries;

  const y0 = min - Y_PADDING > 0 ? 0 : min - Y_PADDING;

  // Transform data for Victory Native v41
  const transformedTideData = tideData.map((datum) => ({
    x: datum.x.getTime(),
    y: datum.y,
    type: datum.type,
  }));

  return (
    <View style={styles.container}>
      <View style={{ height: 130, width: width - 20 }}>
        <CartesianChart
          data={transformedTideData}
          xKey="x"
          yKeys={["y"]}
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
                {/* {dawn.length > 0 && (
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
                )} */}

                {/* Dusk background */}
                {/* {dusk.length > 0 && (
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
                )} */}

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
                  strokeWidth={1}
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

                  // Calculate center of the feeding period for fish positioning
                  const periodStart = solunarTides[0].x.getTime();
                  const periodEnd =
                    solunarTides[solunarTides.length - 1].x.getTime();
                  const periodCenter = (periodStart + periodEnd) / 2;

                  // Find the corresponding point on the tide curve
                  const centerPointIndex = transformedTideData.findIndex(
                    (datum) =>
                      Math.abs(datum.x - periodCenter) ===
                      Math.min(
                        ...transformedTideData.map((d) =>
                          Math.abs(d.x - periodCenter)
                        )
                      )
                  );
                  const centerPoint = points.y[centerPointIndex];
                  const isMajor = isMajorPeriod[i];

                  return (
                    <React.Fragment key={i}>
                      <Area
                        points={solunarPoints}
                        y0={bottomY}
                        color={"rgba(255,255,255, .25)"}
                        opacity={1}
                        curveType="natural"
                      />

                      {/* Fish icons within the feeding period */}
                      {centerPoint && centerPoint.y != null && (
                        <>
                          {isMajor ? (
                            <>
                              <Path
                                path="M 20 30 C 20 20, 40 15, 52 27 L 68 20 L 68 40 L 52 33 C 40 45, 20 40, 20 30 Z"
                                color="black"
                                opacity={0.6}
                                transform={[
                                  {
                                    translateX: centerPoint.x - 13,
                                  },
                                  { translateY: centerPoint.y + -1 },
                                  { scale: 0.3 },
                                ]}
                              />
                              <Path
                                path="M 20 30 C 20 20, 40 15, 52 27 L 68 20 L 68 40 L 52 33 C 40 45, 20 40, 20 30 Z"
                                color="black"
                                opacity={0.6}
                                transform={[
                                  {
                                    translateX: centerPoint.x - 13,
                                  },
                                  { translateY: centerPoint.y + 7 },
                                  { scale: 0.3 },
                                ]}
                              />
                            </>
                          ) : (
                            <Path
                              path="M 20 30 C 20 20, 40 15, 52 27 L 68 20 L 68 40 L 52 33 C 40 45, 20 40, 20 30 Z"
                              color="black"
                              opacity={0.6}
                              transform={[
                                { translateX: centerPoint.x - 8 },
                                { translateY: centerPoint.y + 1 },
                                { scale: 0.2 },
                              ]}
                            />
                          )}
                        </>
                      )}
                    </React.Fragment>
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
    paddingInline: 10,
    paddingTop: 15,
  },
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
