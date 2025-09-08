import { Group, Path } from "@shopify/react-native-skia";
import React from "react";
import { ChartBounds, PointsArray } from "victory-native";
import { blue } from "../../constants/colors";

interface WindRainDropsProps {
  windBasePoints: PointsArray;
  transformedData: {
    x: number;
    windBase: number;
    windGusts: number;
    totalWind: number;
    directionDegrees: number;
    rain: number;
  }[];
  chartBounds: ChartBounds;
  maxWindSpeedForDay: number;
  minYAxisRange: number;
}

const WindRainDrops: React.FC<WindRainDropsProps> = ({
  windBasePoints,
  transformedData,
  chartBounds,
  maxWindSpeedForDay,
  minYAxisRange,
}) => {
  return (
    <Group>
      {windBasePoints.flatMap((point, index) => {
        const rainAmount = transformedData[index]?.rain ?? 0;

        if (rainAmount === 0) {
          return [];
        }

        const dropPath =
          "m80.5,7.11458c-3.14918,-0.14918 -152,228 -1,228c151,0 4.14918,-227.85081 1,-228z";

        // Calculate the top of the stack
        const gustWindValue = transformedData[index]?.windGusts ?? 0;
        const basePointY = point.y ?? 0;
        const chartHeight = chartBounds.bottom - chartBounds.top;
        const maxValue = Math.max(maxWindSpeedForDay, minYAxisRange);
        const gustBarHeightPixels = (gustWindValue / maxValue) * chartHeight;
        const barTopY = basePointY - gustBarHeightPixels;
        const dropBaseY = barTopY - 15;

        let color = blue["500"];
        if (rainAmount >= 5) {
          color = blue["700"]; // heavy rain
        } else if (rainAmount >= 2) {
          color = blue["600"]; // medium rain
        }

        return [
          <Path
            key={`${index}-drop`}
            path={dropPath}
            color={color}
            transform={[
              { translateX: point.x - 4 },
              { translateY: dropBaseY },
              { scale: 0.05 },
            ]}
          />,
        ];
      })}
    </Group>
  );
};

export default WindRainDrops;
