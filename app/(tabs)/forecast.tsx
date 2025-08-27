import FullScreenError from "@/components/FullScreenError";
import { addDays, endOfDay, startOfDay } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import ForecastCard, {
  styles as cardStyles,
  TeaserForecastCard,
} from "../../components/ForecastCard";
import ForecastHeader from "../../components/ForecastHeader";
import LoaderBlock from "../../components/LoaderBlock";
import { gray } from "../../constants/colors";
import { useLocationContext } from "../../context/LocationContext";
import { useUserContext } from "../../context/UserContext";
import { useCombinedForecastV2Query } from "../../graphql/generated";

const NUM_DAYS_PREMIUM = 9;
const NUM_DAYS_FREE = 2;

const ForecastScreen: React.FC = () => {
  const { user } = useUserContext();
  const { activeLocation } = useLocationContext();
  if (!activeLocation) throw new Error("invariant");

  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const numDays = user.entitledToPremium ? NUM_DAYS_PREMIUM : NUM_DAYS_FREE;

  // Reset to first page when location changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeLocation?.id]);

  const { data, loading, error, refetch } = useCombinedForecastV2Query({
    variables: {
      locationId: activeLocation?.id || "",
      startDate: startOfDay(new Date()).toISOString(),
      endDate: addDays(endOfDay(new Date()), numDays).toISOString(),
    },
    skip: !activeLocation?.id,
  });

  // Extract data from GraphQL response
  const forecastData =
    data?.location?.combinedForecastV2?.slice(0, numDays) || [];
  const sunData = data?.location?.sun || [];
  const tideData = data?.location?.tidePreditionStations?.[0]?.tides || [];
  const solunarData = data?.location?.solunar || [];
  const tideStationName =
    data?.location?.tidePreditionStations?.[0]?.name || "";

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handlePageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurrentIndex(e.nativeEvent.position);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ForecastLoaderCard />
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

  // Helper function to render forecast pages
  const renderPages = () => {
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

    // Add teaser page for non-premium users
    if (!user.entitledToPremium) {
      pages.push(
        <View key="teaser-card" collapsable={false}>
          <TeaserForecastCard />
        </View>
      );
    }

    return pages;
  };

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
      >
        {renderPages()}
      </PagerView>
    </View>
  );
};

const ForecastLoaderCard = () => (
  <>
    <View style={styles.headerShimmer}>
      <LoaderBlock styles={styles.loaderBlockHeader} />
    </View>
    <View style={cardStyles.cardWrapper}>
      <View style={[cardStyles.children, styles.loaderContent]}>
        <LoaderBlock styles={styles.loaderBlockBody} />
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  headerShimmer: {
    backgroundColor: gray[700],
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  loaderContent: {
    padding: 15,
  },
  loaderBlockHeader: {
    width: "55%",
    height: 23,
    backgroundColor: gray[600],
  },
  loaderBlockBody: {
    width: "100%",
    height: "100%",
  },
});

export default ForecastScreen;
