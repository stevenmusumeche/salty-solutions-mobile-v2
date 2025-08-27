import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { gray } from "../constants/colors";
import { CombinedForecastV2DetailFragment } from "../graphql/generated";

interface Props {
  data: CombinedForecastV2DetailFragment;
  date: Date;
}

const ForecastChart: React.FC<Props> = ({ data, date }) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Wind/Rain Chart</Text>
        <Text style={styles.placeholderSubtext}>Coming Soon</Text>
      </View>
    </View>
  );
};

export default ForecastChart;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  placeholder: {
    height: 200,
    backgroundColor: gray[100],
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: gray[200],
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: gray[600],
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: gray[500],
  },
});
