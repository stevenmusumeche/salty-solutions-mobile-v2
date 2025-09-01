import { startOfDay } from "date-fns";
import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { white } from "../../constants/colors";
import { useUserContext } from "../../context/UserContext";
import { useTideData } from "../../hooks/useTideData";
import { prepareTideDataForDay } from "../../utils/tide-helpers";
import TideChartLegend from "../forecast/TideChartLegend";
import FullScreenError from "../FullScreenError";
import LoaderBlock from "../LoaderBlock";
import TideChart from "../TideChart";
import TideHighlights from "./TideHighlights";
import TideStationModal from "./TideStationModal";

interface TideCardProps {
  date: Date;
  locationId: string;
  tideStationId?: string;
  usgsSiteId?: string;
  noaaStationId?: string;
  isVisible?: boolean;
}

const TideCard: React.FC<TideCardProps> = ({
  date,
  locationId,
  tideStationId,
  usgsSiteId,
  noaaStationId,
  isVisible = false,
}) => {
  const { user } = useUserContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    tideData,
    sunData,
    moonData,
    solunarData,
    waterHeightData,
    tideStationName,
    waterHeightSiteName,
    loading,
    error,
    refreshing,
    handleRefresh,
  } = useTideData({
    locationId,
    tideStationId,
    date,
    usgsSiteId,
    noaaStationId,
    skip: !isVisible,
  });

  // Process tide data for TideHighlights component
  const processedTideData = useMemo(() => {
    if (!tideData.length || !sunData.length || !solunarData.length) {
      return null;
    }
    return prepareTideDataForDay({
      rawTideData: tideData,
      sunData,
      solunarData,
      date,
    });
  }, [tideData, sunData, solunarData, date]);

  // Filter sun/moon data for current date
  const currentDateSunData = useMemo(() => {
    return sunData.find(
      (x) =>
        startOfDay(new Date(x.sunrise)).toISOString() ===
        startOfDay(date).toISOString()
    );
  }, [sunData, date]);

  const currentDateMoonData = useMemo(() => {
    return moonData.find(
      (x) =>
        startOfDay(new Date(x.date)).toISOString() ===
        startOfDay(date).toISOString()
    );
  }, [moonData, date]);

  const currentDateSolunarData = useMemo(() => {
    return solunarData.find(
      (x) =>
        startOfDay(new Date(x.date)).toISOString() ===
        startOfDay(date).toISOString()
    );
  }, [solunarData, date]);

  if (!isVisible || (loading && !refreshing)) {
    return (
      <View style={styles.loadingContainer}>
        <LoaderBlock styles={styles.loaderBlockBody} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <FullScreenError />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <TideChart
        tideData={tideData}
        sunData={sunData}
        solunarData={solunarData}
        date={date}
        waterHeightData={waterHeightData}
        height={200}
      />

      <View style={styles.legendContainer}>
        <TideChartLegend
          tideStationName={tideStationName || tideStationId || ""}
          observationStationName={waterHeightSiteName}
          showObserved={true}
          onChangePress={() => setIsModalVisible(true)}
        />
      </View>

      {processedTideData && (
        <TideHighlights
          hiLowData={processedTideData.hiLowData}
          sunData={currentDateSunData}
          moonData={currentDateMoonData}
          solunarData={currentDateSolunarData}
          isPremiumUser={user.entitledToPremium}
        />
      )}

      <TideStationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  loaderBlockBody: {
    flexGrow: 1,
    flexShrink: 0,
    width: "auto",
    margin: 15,
  },
  container: {
    flex: 1,
    backgroundColor: white,
  },
  contentContainer: {},
  legendContainer: {
    marginBottom: 15,
  },
});

export default TideCard;
