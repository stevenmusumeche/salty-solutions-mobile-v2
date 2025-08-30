import { Group, Path } from "@shopify/react-native-skia";
import React from "react";
import { PointsArray } from "victory-native";
import { gray } from "../../constants/colors";

interface WindCompassArrowsProps {
  windBasePoints: PointsArray;
  directionPoints: PointsArray;
}

const WindCompassArrows: React.FC<WindCompassArrowsProps> = ({
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

export default WindCompassArrows;