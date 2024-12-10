import { differenceInHours, format } from "date-fns";
import React, { useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CartesianChart, Line, Scatter } from "victory-native";
import { black, gray, yellow } from "../colors";
import { Group, Path, scale, useFont } from "@shopify/react-native-skia";
// @ts-ignore
import inter from "../assets/fonts/inter-medium.ttf";

interface Props {
  children?: React.ReactNode;
  data: {
    y: number;
    x: number;
    directionDegrees: number;
    [other: string]: any;
  }[];
  dependentAxisNumDecimals?: number;
  fullScreen?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  tickCount?: number;
}

export const CardChart: React.FC<Props> = ({
  data,
  children,
  fullScreen = false,
  onPress,
  width,
  height,
  tickCount = 2,
}) => {
  const font = useFont(inter, 12);
  const { width: windowWidth } = useWindowDimensions();

  // reduce the number of data points to display on the graph
  const cleanedData = useMemo(() => {
    const mod = Math.ceil(data.length / 72);
    if (mod > 1) {
      return data.filter((_: any, i: number) => i % mod === 0);
    }
    return data;
  }, [data]);

  const { minY, maxY } = useMemo(() => {
    const minY = Math.min(...cleanedData.map((d) => d.y));
    const maxY = Math.max(...cleanedData.map((d) => d.y));
    return { minY, maxY };
  }, [cleanedData]);

  const chartWidth = width ?? windowWidth / 2 - 50;
  const chartHeight = height ?? 140;

  return (
    <View
      style={[
        styles.container,
        { width: chartWidth, height: chartHeight - (fullScreen ? 60 : 0) },
      ]}
    >
      <CartesianChart
        data={cleanedData}
        xKey="x"
        yKeys={["y", "directionDegrees"]}
        domain={{ y: [minY, maxY] }}
        domainPadding={{ top: 10, bottom: 10, left: 5, right: 15 }}
        padding={{
          left: 0,
          top: 10,
          right: 0,
          bottom: 0,
        }}
        yAxis={[
          {
            font,
            lineWidth: 0,
          },
        ]}
        xAxis={{
          font,
          tickValues: [
            data[0].x,
            data[Math.floor(data.length / 2)].x,
            data[data.length - 1].x,
          ],
          lineWidth: 0,
          formatXLabel(date) {
            const dateObj = new Date(date);
            if (fullScreen) {
              return format(dateObj, "ccc") + "\n" + format(dateObj, "ha");
            }

            const hourDiff = Math.abs(differenceInHours(dateObj, new Date()));
            if (hourDiff >= 46) {
              return "-2d";
            } else if (hourDiff >= 18) {
              return "-1d";
            }
            return "now";
          },
        }}
        frame={{
          lineWidth: { left: 1, bottom: 1, right: 0, top: 0 },
          lineColor: black,
        }}
      >
        {({
          points,
          xScale,
          yScale,
          xTicks,
          yTicks,
          canvasSize,
          chartBounds,
        }) => {
          // console.log(1, points["y"][0], xScale(xTicks[0]), yScale(yTicks[0]));
          // console.log(2, chartBounds);
          // console.log(3, canvasSize);

          // const transformAngle = Math.abs(
          //   points["directionDegrees"][0].yValue + 180
          // );
          // console.log(3, transformAngle);
          return (
            <>
              <Line
                points={points.y}
                color={yellow[700]}
                strokeWidth={fullScreen ? 2 : 1}
                curveType="natural"
              />
              <Group>
                {points.y.flatMap((point, index, list) => {
                  const numEntries = list.length;
                  const mod = fullScreen ? 16 : 8;
                  if (index % Math.floor(numEntries / mod) !== 0) {
                    return [];
                  }

                  const direction =
                    points["directionDegrees"][index].yValue ?? 0;
                  const transformAngle = Math.abs(direction + 180);

                  // arrow icon
                  return [
                    <Path
                      key={index}
                      path="m0.475,11.94427l4.525,-11.49427l4.5,11.55l-4.5,-2.5l-4.525,2.45z"
                      color="black"
                      transform={[
                        // First do the point translation
                        { translateX: point.x - 5 },
                        { translateY: (point.y ?? 0) - 10 },
                        // Then do the rotation around the center of the arrow
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
            </>
          );
        }}
      </CartesianChart>
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     {wrapWithTouchable(
  //       <VictoryChart
  //         padding={{
  //           left: 23,
  //           top: 10,
  //           right: 10,
  //           bottom: fullScreen ? 24 : 12,
  //         }}
  //         domainPadding={{ y: [30, 30] }}
  //         height={chartHeight - (fullScreen ? 60 : 0)}
  //         width={chartWidth}
  //       >
  //         <VictoryAxis
  //           fixLabelOverlap={false}
  //           tickCount={tickCount}
  //           tickFormat={(date: string) => {
  //             const dateObj = new Date(date);
  //             if (fullScreen) {
  //               return format(dateObj, "ccc") + "\n" + format(dateObj, "ha");
  //             }

  //             const hourDiff = Math.abs(differenceInHours(dateObj, new Date()));
  //             if (hourDiff >= 46) {
  //               return "-2d";
  //             } else if (hourDiff >= 18) {
  //               return "-1d";
  //             }
  //             return "now";
  //           }}
  //           style={{
  //             tickLabels: { fontSize: 11, padding: 1 },
  //             grid: {
  //               stroke: gray[500],
  //               strokeDasharray: "6, 6",
  //               strokeWidth: fullScreen ? 0.5 : 1,
  //             },
  //           }}
  //         />
  //         <VictoryAxis
  //           scale={{ x: "time" }}
  //           dependentAxis
  //           style={{ tickLabels: { fontSize: 11, padding: 3 } }}
  //           tickFormat={(x, i, ticks) => {
  //             // if the ticks with no decimals contain duplicates, then use a decimal
  //             const withNoDecimals = ticks.map((tick) => tick.toFixed(0));
  //             if (withNoDecimals.length > new Set([...withNoDecimals]).size) {
  //               return x.toFixed(1);
  //             }
  //             return x.toFixed(0);
  //           }}
  //         />
  //         <VictoryGroup data={data}>
  //           <VictoryLine
  //             interpolation="natural"
  //             style={{
  //               data: {
  //                 stroke: yellow[700],
  //                 strokeWidth: fullScreen ? 2 : 1,
  //               },
  //             }}
  //           />
  //           {children}
  //         </VictoryGroup>
  //       </VictoryChart>,
  //       onPress
  //     )}
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    height: 300,
  },
});

function wrapWithTouchable(children: any, onPress?: () => void) {
  if (!onPress) {
    return children;
  }

  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}
