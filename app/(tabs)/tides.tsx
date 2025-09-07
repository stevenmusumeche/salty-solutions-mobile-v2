import { addDays, startOfDay, subDays } from "date-fns";
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
import PagerHeader from "../../components/PagerHeader";
import TideCard from "../../components/tide/TideCard";
import { useLocationContext } from "../../context/LocationContext";
import { useTideContext } from "../../context/TideContext";
import { formatRelativeDate } from "../../utils/date-helpers";

const SCROLL_THRESHOLD = 0.7; // Threshold for triggering early header animation
const REVERSE_SCROLL_THRESHOLD = 1 - SCROLL_THRESHOLD;

// Static dates array: 7 days in past + today + 30 days in future = 38 total days
const DATES = (() => {
  const today = startOfDay(new Date());
  const startDate = subDays(today, 7);
  const dates = [];
  for (let i = 0; i < 38; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
})();

const TideScreen: React.FC = () => {
  const { activeLocation } = useLocationContext();
  const { selectedTideStation, selectedSite } = useTideContext();

  if (!activeLocation) throw new Error("invariant");

  const [currentIndex, setCurrentIndex] = useState(7); // Start at today (index 7 in -7 to +30 range)
  const pagerRef = useRef<PagerView>(null);

  // Reset to today when location changes
  useEffect(() => {
    setCurrentIndex(7);
    pagerRef.current?.setPage(7);
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

  // Get title for current page
  const getTitle = useCallback((index: number) => {
    if (!DATES[index]) return "";
    return formatRelativeDate(DATES[index].toISOString());
  }, []);

  // Render a page for each date
  const tidePages = useMemo(() => {
    return DATES.map((date, index) => {
      const isVisible =
        index === currentIndex || // Current page
        index === currentIndex - 1 || // Previous page for smooth swiping
        index === currentIndex + 1; // Next page for smooth swiping

      return (
        <View key={date.toISOString()} collapsable={false}>
          <TideCard
            date={date}
            locationId={activeLocation.id}
            tideStationId={selectedTideStation?.id}
            usgsSiteId={
              selectedSite?.__typename === "UsgsSite"
                ? selectedSite.id
                : undefined
            }
            noaaStationId={
              selectedSite?.__typename === "TidePreditionStation"
                ? selectedSite.id
                : undefined
            }
            isVisible={isVisible}
          />
        </View>
      );
    });
  }, [currentIndex, activeLocation.id, selectedTideStation, selectedSite]);

  return (
    <View style={styles.container}>
      <PagerHeader
        currentIndex={currentIndex}
        totalPages={DATES.length}
        getTitle={getTitle}
        showDots={false}
      />
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={7}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
      >
        {tidePages}
      </PagerView>
    </View>
  );
};

export default TideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pagerView: {
    flex: 1,
  },
});
