import { gray } from "@/colors";
import React from "react";
import { View, StyleSheet } from "react-native";

interface Props {
  styles?: any;
}

const LoaderBlock: React.FC<Props> = (props) => (
  <View style={[styles.container, { ...props.styles }]} />
);

export default LoaderBlock;

const styles = StyleSheet.create({
  container: {
    backgroundColor: gray[300],
    width: "80%",
    height: 210,
  },
});
