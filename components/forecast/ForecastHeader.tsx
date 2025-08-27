import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { gray, white } from "../../constants/colors";
import { CombinedForecastV2DetailFragment } from "../../graphql/generated";

interface ForecastHeaderProps {
  currentIndex: number;
  data: CombinedForecastV2DetailFragment[];
  user: {
    isLoggedIn: boolean;
    entitledToPremium: boolean;
  };
}

const ForecastHeader: React.FC<ForecastHeaderProps> = ({ currentIndex, data, user }) => {
  const currentData = data[currentIndex];

  const title = currentData
    ? `${currentData.name} ${format(new Date(currentData.date), "M/d")}`
    : "";

  const canSwipeLeft = currentIndex > 0;
  const canSwipeRight = user.isLoggedIn
    ? currentIndex < data.length - 1
    : currentIndex < data.length;

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <MaterialCommunityIcons
          name="gesture-swipe-right"
          size={20}
          color={canSwipeLeft ? styles.swipeIconVisible.color : "transparent"}
        />

        <Text style={styles.headerText}>{title}</Text>

        <MaterialCommunityIcons
          name="gesture-swipe-left"
          size={20}
          color={canSwipeRight ? styles.swipeIconVisible.color : "transparent"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: gray[700],
    paddingVertical: 10,
    width: "100%",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  headerText: {
    color: white,
    fontSize: 17,
    fontWeight: "600",
  },
  swipeIconVisible: {
    color: "rgba(255,255,255,.6)",
  },
});

export default ForecastHeader;