import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { gray, white } from "../../constants/colors";

interface PageDotsProps {
  currentIndex: number;
  totalPages: number;
  variant?: "light" | "dark";
}

const PageDots: React.FC<PageDotsProps> = ({ currentIndex, totalPages, variant = "light" }) => {
  // Hide dots if there's only one page (no swipe navigation needed)
  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <AnimatedDot key={index} isActive={index === currentIndex} variant={variant} />
      ))}
    </View>
  );
};

// Individual animated dot that scales and fades based on active state
const AnimatedDot: React.FC<{ isActive: boolean; variant: "light" | "dark" }> = ({ isActive, variant }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(isActive ? 1 : 0.4, { duration: 200 });
    const scale = withTiming(isActive ? 1.2 : 1, { duration: 200 });

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const dotStyle = variant === "dark" 
    ? { ...styles.dot, backgroundColor: gray[700] }
    : styles.dot;

  return <Animated.View style={[dotStyle, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: white,
  },
});

export default PageDots;