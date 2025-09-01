import { format, startOfDay } from "date-fns";
import React, { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { gray, white } from "../../constants/colors";
import { useUserContext } from "../../context/UserContext";
import { useTideData } from "../../hooks/useTideData";
import { prepareTideDataForDay } from "../../utils/tide-helpers";
import FullScreenError from "../FullScreenError";
import LoaderBlock from "../LoaderBlock";
import TideChart from "../TideChart";
import TideHighlights from "./TideHighlights";

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

  const dateString = format(date, "EEEE, MMMM d, yyyy");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={{ padding: 15 }}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tide Station</Text>
          <Text style={styles.sectionContent}>
            {tideStationName || tideStationId || "No station selected"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tide Events</Text>
          <Text style={styles.sectionContent}>
            {tideData.length > 0
              ? `${tideData.length} tide events found`
              : "No tide data available"}
          </Text>
        </View>

        {waterHeightSiteName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Water Height Site</Text>
            <Text style={styles.sectionContent}>{waterHeightSiteName}</Text>
            <Text style={styles.sectionContent}>
              {waterHeightData.length > 0
                ? `${waterHeightData.length} water height readings`
                : "No water height data available"}
            </Text>
          </View>
        )}

        {sunData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sun & Moon</Text>
            <Text style={styles.sectionContent}>
              Sun data: {sunData.length} entries
            </Text>
            <Text style={styles.sectionContent}>
              Moon data: {moonData.length} entries
            </Text>
          </View>
        )}

        {solunarData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solunar Data</Text>
            <Text style={styles.sectionContent}>
              {solunarData.length} solunar periods found
            </Text>
          </View>
        )}
      </View>

      {/* Tide Chart - part of scrollable content */}
      {tideData.length > 0 && sunData.length > 0 && (
        <TideChart
          tideData={tideData}
          sunData={sunData}
          solunarData={solunarData}
          date={date}
          stationName={tideStationName || tideStationId || ""}
          showLegend={false}
          waterHeightData={waterHeightData}
        />
      )}

      {/* Tide Highlights Section - part of scrollable content */}
      {processedTideData && (
        <TideHighlights
          hiLowData={processedTideData.hiLowData}
          sunData={currentDateSunData}
          moonData={currentDateMoonData}
          solunarData={currentDateSolunarData}
          isPremiumUser={user.entitledToPremium}
        />
      )}
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
  contentContainer: {
    // paddingBottom: 15, // Keep bottom padding for ScrollView
  },
  dateHeader: {
    marginBottom: 16,
    paddingHorizontal: 15, // Add horizontal padding to content
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    backgroundColor: gray[100],
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: gray[900],
  },
  sectionContent: {
    fontSize: 14,
    color: gray[700],
    marginBottom: 4,
  },
});

export default TideCard;
