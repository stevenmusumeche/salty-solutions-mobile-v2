import { DataSite } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { blue, gray } from "../constants/colors";

interface Props {
  selectedSite: DataSite;
  onChangePress: () => void;
  enableEdit: boolean;
}

export const SiteDisplay: React.FC<Props> = ({
  selectedSite,
  onChangePress,
  enableEdit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.siteText} numberOfLines={1}>
        {selectedSite.name}
      </Text>
      {enableEdit && (
        <TouchableOpacity style={styles.changeButton} onPress={onChangePress}>
          <Text style={styles.changeText}>Change Station</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  siteText: {
    textAlign: "center",
    textTransform: "uppercase",
    color: gray[600],
    fontSize: 10,
    letterSpacing: -0.1,
  },
  changeButton: {
    alignItems: "center",
  },
  changeText: {
    fontSize: 10,
    color: blue[600],
    fontWeight: "400",
    paddingTop: 5,
  },
});
