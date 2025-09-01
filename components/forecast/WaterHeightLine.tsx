import { endOfDay, startOfDay } from "date-fns";
import React from "react";
import { ChartBounds, Line } from "victory-native";
import { black } from "../../constants/colors";
import { TideDataset } from "../../utils/tide-helpers";

interface WaterHeightLineProps {
  waterHeightData: TideDataset[];
  date: Date;
  chartBounds: ChartBounds;
  yDomainMin: number;
  yDomainMax: number;
}

const WaterHeightLine: React.FC<WaterHeightLineProps> = ({
  waterHeightData,
  date,
  chartBounds,
  yDomainMin,
  yDomainMax,
}) => {
  if (!waterHeightData.length) {
    return null;
  }

  // Transform water height data to chart points
  const waterObservationPoints = waterHeightData.map((data) => {
    const xRatio =
      (data.x.getTime() - startOfDay(date).getTime()) /
      (endOfDay(date).getTime() - startOfDay(date).getTime());
    const yRatio = (data.y - yDomainMin) / (yDomainMax - yDomainMin);
    return {
      x: chartBounds.left + xRatio * (chartBounds.right - chartBounds.left),
      y: chartBounds.bottom - yRatio * (chartBounds.bottom - chartBounds.top),
      xValue: data.x.getTime(),
      yValue: data.y,
    };
  });

  return (
    <Line
      points={waterObservationPoints}
      color={black}
      strokeWidth={2}
      curveType="natural"
    />
  );
};

export default WaterHeightLine;