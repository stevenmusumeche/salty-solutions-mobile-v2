import { DataSite } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import deepMerge from "deepmerge";
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { blue, gray } from "../constants/colors";

const UsgsSiteSelect: React.FC<{
  sites: DataSite[];
  handleChange: (selectedId: string) => void;
  selectedId: string;
  style?: any;
}> = ({ sites, handleChange, selectedId, style = {} }) => {
  const onValueChange = useCallback(
    (selectedSiteId?: string) => {
      if (selectedSiteId) {
        handleChange(selectedSiteId);
      }
    },
    [handleChange]
  );

  return (
    <RNPickerSelect
      useNativeAndroidPickerStyle={false}
      value={selectedId}
      placeholder={{ label: "Select Observation Site:" }}
      onValueChange={onValueChange}
      items={sites.map((site) => ({
        label: site.name,
        value: site.id,
      }))}
      style={deepMerge(pickerSelectStyles, style)}
      Icon={() => {
        return (
          <MaterialIcons name="arrow-drop-down" size={20} color={blue[800]} />
        );
      }}
    />
  );
};

export default UsgsSiteSelect;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: gray[300],
    borderRadius: 4,
    color: "black",
    paddingRight: 16, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 20,
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    borderColor: gray[300],
    borderRadius: 4,
    color: "black",
    paddingRight: 16, // to ensure the text is never behind the icon
  },
});
