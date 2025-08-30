import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  const currentData = data[currentIndex];

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [displayTitle, setDisplayTitle] = useState("");
  const [previousIndex, setPreviousIndex] = useState(0);

  const title = currentData
    ? `${currentData.name} ${format(new Date(currentData.date), "M/d")}`
    : "";

  useEffect(() => {
    // Initial setup: set the first title without animation
    if (displayTitle === "") {
      setDisplayTitle(title);
      setPreviousIndex(currentIndex);
      return;
    }

    // Prevent animation if index hasn't actually changed
    // This happens because onPageScroll can fire multiple times with same index
    if (currentIndex === previousIndex) {
      return;
    }

    // Determine swipe direction based on index change
    // currentIndex > previousIndex = swiping left = going to future days = forward
    // currentIndex < previousIndex = swiping right = going to past days = backward
    const isGoingForward = currentIndex > previousIndex;
    const slideDistance = 30; // How far text moves during transition

    if (isGoingForward) {
      // FORWARD ANIMATION (swiping left to future days)
      // 1. Current text slides out to the left while fading out
      translateX.value = withTiming(-slideDistance, { duration: 150 });
      opacity.value = withTiming(0, { duration: 100 }, () => {
        // 2. When fade out completes, update the displayed text
        runOnJS(setDisplayTitle)(title);
        runOnJS(setPreviousIndex)(currentIndex);
        // 3. Position new text to the right (off-screen)
        translateX.value = slideDistance;
        // 4. Slide new text in from right while fading in
        translateX.value = withTiming(0, { duration: 100 });
        opacity.value = withTiming(1, { duration: 100 });
      });
    } else {
      // BACKWARD ANIMATION (swiping right to past days)
      // 1. Current text slides out to the right while fading out
      translateX.value = withTiming(slideDistance, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 }, () => {
        // 2. When fade out completes, update the displayed text
        runOnJS(setDisplayTitle)(title);
        runOnJS(setPreviousIndex)(currentIndex);
        // 3. Position new text to the left (off-screen)
        translateX.value = -slideDistance;
        // 4. Slide new text in from left while fading in
        translateX.value = withTiming(0, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      });
    }
  }, [currentIndex, translateX, opacity, title, displayTitle, previousIndex]);

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
