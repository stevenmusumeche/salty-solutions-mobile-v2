import {
  differenceInDays,
  format,
  isToday,
  isTomorrow,
  startOfDay,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { gray, white } from "../../constants/colors";
import { CombinedForecastV2DetailFragment } from "../../graphql/generated";
import PageDots from "./PageDots";

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
  const [displayTitle, setDisplayTitle] = useState(() => {
    const currentData = data[currentIndex];
    return currentData ? formatRelativeDate(currentData.date) : "";
  });

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
    let title = "";

    if (currentData) {
      title = formatRelativeDate(currentData.date);
    } else if (currentIndex >= data.length && !user.entitledToPremium) {
      // User is on teaser page
      title = "Upgrade for More";
    }

    setDisplayTitle(title);
  }, [currentIndex, data, user.entitledToPremium]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <Animated.Text style={[styles.headerText, animatedStyle]}>
          {displayTitle}
        </Animated.Text>
      </View>
      {/* Page dots show swipe navigation - includes teaser page for free users */}
      <PageDots
        currentIndex={currentIndex}
        totalPages={data.length + (user.entitledToPremium ? 0 : 1)}
      />
    </View>
  );
};

// Converts date strings into natural relative day names
// Examples: "Today", "Tomorrow", "Saturday", "Next Friday"
function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  const dayName = format(date, "EEEE");
  const daysFromToday = differenceInDays(
    startOfDay(date),
    startOfDay(new Date())
  );

  // Only use "Next" prefix for dates that are 7+ days away (truly next week)
  // This matches natural speech: "Sunday" (this weekend) vs "Next Friday" (week after)
  if (daysFromToday >= 7) {
    return `Next ${dayName}`;
  }

  return dayName;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: gray[700],
    paddingVertical: 10,
    width: "100%",
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  headerText: {
    color: white,
    fontSize: 17,
    fontWeight: "600",
  },
});

export default ForecastHeader;
