import { Group, Path, useFont } from "@shopify/react-native-skia";
import { addHours, format } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { CartesianChart, StackedBar } from "victory-native";
import { black, blue, gray } from "../../constants/colors";
import { CombinedForecastV2DetailFragment } from "../../graphql/generated";
import { prepareForecastData } from "../../utils/forecast-helpers";
import ChartLabelSwatch from "../ChartLabelSwatch";
// @ts-ignore
import inter from "../../assets/fonts/inter-medium.ttf";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const MIN_CHART_SCALE = 25;

const ForecastChart: React.FC<Props> = ({ data, date }) => {
  const font = useFont(inter, 12);
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
          padding={{ left: 0, top: 0, right: 17, bottom: 0 }}
          domainPadding={{ left: 6, right: 6, top: 10, bottom: 0 }}
          domain={{
            x: [date.getTime(), addHours(date, 23).getTime()],
            y: [0, Math.max(maxWindSpeedForDay, MIN_CHART_SCALE)],
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
                <CompassArrows
                  windBasePoints={points.windBase}
                  directionPoints={points["directionDegrees"]}
                />
                {/* <Group>
                  {points.windBase.flatMap((point, index) => {
                    const rainAmount = transformedData[index]?.rain ?? 0;
                    if (rainAmount === 0) {
                      return [];
                    }

                    let numDrops = 1;
                    if (rainAmount >= 6) {
                      numDrops = 3;
                    } else if (rainAmount >= 3) {
                      numDrops = 2;
                    }

                    const drops = [];
                    const dropPath =
                      "m80.5,7.11458c-3.14918,-0.14918 -152,228 -1,228c151,0 4.14918,-227.85081 1,-228z";

                    // Calculate total bar height (base + gusts)
                    const gustPoint = points.windGusts[index];
                    const totalBarTop = gustPoint?.y ?? point.y ?? 0;

                    if (numDrops >= 1) {
                      drops.push(
                        <Path
                          key={`${index}-drop-1`}
                          path={dropPath}
                          color={blue[500]}
                          transform={[
                            { scale: 0.05 },
                            { translateX: point.x - 4 },
                            { translateY: totalBarTop - 15 },
                          ]}
                        />
                      );
                    }

                    if (numDrops >= 2) {
                      drops.push(
                        <Path
                          key={`${index}-drop-2`}
                          path={dropPath}
                          color={blue[500]}
                          transform={[
                            { scale: 0.028 },
                            { translateX: point.x + 1 },
                            { translateY: totalBarTop - 17 },
                          ]}
                        />
                      );
                    }

                    if (numDrops >= 3) {
                      drops.push(
                        <Path
                          key={`${index}-drop-3`}
                          path={dropPath}
                          color={blue[500]}
                          transform={[
                            { scale: 0.02 },
                            { translateX: point.x - 1.2 },
                            { translateY: totalBarTop - 20 },
                          ]}
                        />
                      );
                    }

                    return drops;
                  })}
                </Group> */}
              </>
            );
          }}
        </CartesianChart>
      </View>
      <ChartLegend />
    </View>
  );
};

export default ForecastChart;

const EmptyChart: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.placeholderText}>No wind data available</Text>
  </View>
);

interface CompassArrowsProps {
  windBasePoints: any[];
  directionPoints: any[];
}

const CompassArrows: React.FC<CompassArrowsProps> = ({
  windBasePoints,
  directionPoints,
}) => {
  return (
    <Group>
      {windBasePoints.flatMap((point, index) => {
        if (index % 2 !== 1) {
          return [];
        }

        const direction = directionPoints[index]?.yValue ?? 0;
        const transformAngle = Math.abs(direction + 180);

        return [
          <Path
            key={index}
            path="m0.475,11.94427l4.525,-11.49427l4.5,11.55l-4.5,-2.5l-4.525,2.45z"
            color={gray[800]}
            transform={[
              { translateX: point.x - 5 },
              { translateY: 0 },
              { translateX: 5.5 },
              { translateY: 6.25 },
              { rotate: transformAngle * (Math.PI / 180) },
              { translateX: -5.5 },
              { translateY: -6.25 },
            ]}
          />,
        ];
      })}
    </Group>
  );
};

const ChartLegend: React.FC = () => {
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
