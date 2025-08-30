import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
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

const ForecastHeader: React.FC<ForecastHeaderProps> = ({
  currentIndex,
  data,
  user,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const currentIndexShared = useSharedValue(currentIndex);
  const [displayTitle, setDisplayTitle] = useState("");

  // Use animated reaction to handle index changes on UI thread
  useAnimatedReaction(
    () => currentIndex,
    (newIndex, previousIndex) => {
      if (newIndex === previousIndex || previousIndex === null) {
        return;
      }

      const isGoingForward = newIndex > previousIndex;
      const slideDistance = 30;

      if (isGoingForward) {
        // FORWARD ANIMATION (swiping left to future days)
        translateX.value = withTiming(-slideDistance, { duration: 150 });
        opacity.value = withTiming(0, { duration: 100 }, () => {
          currentIndexShared.value = newIndex;
          translateX.value = slideDistance;
          translateX.value = withTiming(0, { duration: 100 });
          opacity.value = withTiming(1, { duration: 100 });
        });
      } else {
        // BACKWARD ANIMATION (swiping right to past days)
        translateX.value = withTiming(slideDistance, { duration: 150 });
        opacity.value = withTiming(0, { duration: 150 }, () => {
          currentIndexShared.value = newIndex;
          translateX.value = -slideDistance;
          translateX.value = withTiming(0, { duration: 150 });
          opacity.value = withTiming(1, { duration: 150 });
        });
      }
    }
  );

  // Update displayed title when data or index changes
  useEffect(() => {
    const currentData = data[currentIndex];
    const title = currentData
      ? `${currentData.name} ${format(new Date(currentData.date), "M/d")}`
      : "";
    setDisplayTitle(title);
  }, [currentIndex, data]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

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

        <Animated.Text style={[styles.headerText, animatedStyle]}>
          {displayTitle}
        </Animated.Text>

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
