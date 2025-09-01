import { Rect } from "@shopify/react-native-skia";
import { endOfDay, startOfDay } from "date-fns";
import React from "react";
import { ChartBounds } from "victory-native";
import { gray } from "../../constants/colors";

interface TideChartSkyBackgroundProps {
  date: Date;
  chartBounds: ChartBounds;
  daylight: { x: Date; y: number }[];
  dawn?: { x: Date; y: number }[];
  dusk?: { x: Date; y: number }[];
}

const TideChartSkyBackground: React.FC<TideChartSkyBackgroundProps> = ({
  date,
  daylight,
  chartBounds,
  dawn,
  dusk,
}) => {
  const chartHeight = chartBounds.bottom - chartBounds.top;
  const chartWidth = chartBounds.right - chartBounds.left;
  const startTime = startOfDay(date).getTime();
  const endTime = endOfDay(date).getTime();
  const timeRange = endTime - startTime;

  return (
    <>
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
            ((daylight[0].x.getTime() - startTime) / timeRange) * chartWidth
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
      {dawn && dawn.length > 0 && (
        <Rect
          x={
            chartBounds.left +
            ((dawn[0].x.getTime() - startTime) / timeRange) * chartWidth
          }
          y={chartBounds.top}
          width={
            ((dawn[dawn.length - 1].x.getTime() - dawn[0].x.getTime()) /
              timeRange) *
            chartWidth
          }
          height={chartHeight}
          color={gray[500]}
        />
      )}

      {/* Dusk background */}
      {dusk && dusk.length > 0 && (
        <Rect
          x={
            chartBounds.left +
            ((dusk[0].x.getTime() - startTime) / timeRange) * chartWidth
          }
          y={chartBounds.top}
          width={
            ((dusk[dusk.length - 1].x.getTime() - dusk[0].x.getTime()) /
              timeRange) *
            chartWidth
          }
          height={chartHeight}
          color={gray[500]}
        />
      )}
    </>
  );
};

export default TideChartSkyBackground;
