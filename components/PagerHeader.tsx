import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { gray, white } from "../constants/colors";
import PageDots from "./forecast/PageDots";

interface PagerHeaderProps {
  currentIndex: number;
  totalPages: number;
  getTitle: (index: number) => string;
  showDots?: boolean;
}

const PagerHeader: React.FC<PagerHeaderProps> = ({
  currentIndex,
  totalPages,
  getTitle,
  showDots = true,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const currentIndexShared = useSharedValue(currentIndex);
  const [displayTitle, setDisplayTitle] = useState(() => {
    return getTitle(currentIndex);
  });

  // Use animated reaction to handle index changes on UI thread
  useAnimatedReaction(
    () => currentIndex,
    (newIndex, previousIndex) => {
      if (newIndex === previousIndex || previousIndex === null) {
        return;
      }

      const isGoingForward = newIndex > previousIndex;
      const slideDistance = 50;

      // Start fade out of current text
      opacity.value = withTiming(0, { duration: 150 });

      // Set starting position and opacity for incoming text
      if (isGoingForward) {
        translateX.value = slideDistance; // Start from right
      } else {
        translateX.value = -slideDistance; // Start from left
      }

      // Update content immediately but keep it invisible
      currentIndexShared.value = newIndex;
      opacity.value = 0; // Ensure new text starts invisible
      
      // Now animate the new text in
      translateX.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(1, { duration: 150 });
    }
  );

  // Update displayed title when index changes
  useEffect(() => {
    setDisplayTitle(getTitle(currentIndex));
  }, [currentIndex, getTitle]);

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
      {showDots && (
        <PageDots currentIndex={currentIndex} totalPages={totalPages} />
      )}
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

export default PagerHeader;
