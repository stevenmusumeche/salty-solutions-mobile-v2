import FullScreenError from "@/components/FullScreenError";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEvent,
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import ForecastCard, {
  TeaserForecastCard,
} from "../../components/forecast/ForecastCard";
import ForecastHeader from "../../components/forecast/ForecastHeader";
import ForecastLoader from "../../components/forecast/ForecastLoader";
import { useLocationContext } from "../../context/LocationContext";
import { useUserContext } from "../../context/UserContext";
import { useForecastData } from "../../hooks/useForecastData";

const SCROLL_THRESHOLD = 0.7; // Threshold for triggering early header animation
const REVERSE_SCROLL_THRESHOLD = 1 - SCROLL_THRESHOLD;

const ForecastScreen: React.FC = () => {
  const { user } = useUserContext();
  const { activeLocation } = useLocationContext();
  if (!activeLocation) throw new Error("invariant");

  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const {
    forecastData,
    sunData,
    tideData,
    solunarData,
    tideStationName,
    loading,
    error,
    refreshing,
    handleRefresh,
  } = useForecastData({
    locationId: activeLocation?.id,
    isEntitledToPremium: user.entitledToPremium,
  });

  // Reset to first page when location changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeLocation.id]);

  // Updates index when page settles after swipe completes
  const handlePageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurrentIndex(e.nativeEvent.position);
  }, []);

  // Updates index during swipe for early header animation trigger
  const handlePageScroll = useCallback(
    (e: PagerViewOnPageScrollEvent) => {
      const { position, offset } = e.nativeEvent;

      if (offset > SCROLL_THRESHOLD && position + 1 !== currentIndex) {
        setCurrentIndex(position + 1);
      } else if (
        offset < REVERSE_SCROLL_THRESHOLD &&
        position !== currentIndex
      ) {
        setCurrentIndex(position);
      }
    },
    [currentIndex]
  );

  // Render a page for each day (and a teaser page for free users)
  const forecastPages = useMemo(() => {
    const pages = [];

    // Add forecast data pages
    forecastData.forEach((item) => {
      pages.push(
        <View key={item.name} collapsable={false}>
          <ForecastCard
            datum={item}
            sunData={sunData}
            tideData={tideData}
            tideStationName={tideStationName}
            dateString={item.date}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            solunarData={solunarData}
          />
        </View>
      );
    });

    // Add teaser page for free users
    if (!user.entitledToPremium) {
      pages.push(
        <View key="teaser-card" collapsable={false}>
          <TeaserForecastCard />
        </View>
      );
    }

    return pages;
  }, [
    forecastData,
    sunData,
    tideData,
    tideStationName,
    refreshing,
    handleRefresh,
    solunarData,
    user.entitledToPremium,
  ]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ForecastLoader />
      </View>
    );
  }

  if (error && !forecastData.length) {
    return (
      <View style={styles.container}>
        <FullScreenError />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ForecastHeader
        currentIndex={currentIndex}
        data={forecastData}
        user={user}
      />
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
      >
        {forecastPages}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
});

export default ForecastScreen;
