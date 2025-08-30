import { Group, matchFont, Path } from "@shopify/react-native-skia";
import { differenceInHours, format } from "date-fns";
import React, { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CartesianChart, Line } from "victory-native";
import { black, yellow } from "../constants/colors";

interface Props {
  data: {
    y: number;
    x: number;
    directionDegrees?: number;
    [other: string]: any;
  }[];
  fullScreen?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  showDirectionArrows?: boolean;
}

export const CardChart: React.FC<Props> = ({
  data,
  fullScreen = false,
  onPress,
  width,
  height,
  showDirectionArrows = false,
}) => {
  const fontFamily = Platform.select({
    ios: "Helvetica",
    android: "Roboto",
    default: "sans-serif",
  });
  const font = matchFont({ fontFamily, fontSize: 10 });
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

  return wrapWithTouchable(
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
          tickValues: fullScreen
            ? undefined
            : [
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
        {({ points }) => {
          return (
            <>
              <Line
                points={points.y}
                color={yellow[700]}
                strokeWidth={fullScreen ? 2 : 1}
                curveType="natural"
              />
              {showDirectionArrows ? (
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
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>,
    onPress
  );
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
