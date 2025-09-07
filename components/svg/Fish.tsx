import { gray } from "@/constants/colors";
import { Path } from "@shopify/react-native-skia";
import React from "react";

interface FishProps {
  transform?: any[];
}

const Fish: React.FC<FishProps> = ({ transform = [] }) => {
  return (
    <Path
      path="M 20 30 C 20 20, 40 15, 52 27 L 68 20 L 68 40 L 52 33 C 40 45, 20 40, 20 30 Z"
      color={gray["800"]}
      opacity={1}
      transform={transform}
    />
  );
};

export default Fish;
