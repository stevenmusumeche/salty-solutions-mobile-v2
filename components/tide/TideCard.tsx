import { format } from "date-fns";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { blue, gray, white } from "../../constants/colors";
import { useTideData } from "../../hooks/useTideData";
import LoaderBlock from "../LoaderBlock";

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
    skip: !isVisible, // Only fetch data when card is visible
  });

  // Show placeholder when not visible
  if (!isVisible) {
    return <View style={styles.container}></View>;
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <LoaderBlock />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading tide data</Text>
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

      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Info</Text>
        <Text style={styles.debugText}>Location ID: {locationId}</Text>
        <Text style={styles.debugText}>
          Tide Station ID: {tideStationId || "None"}
        </Text>
        <Text style={styles.debugText}>
          USGS Site ID: {usgsSiteId || "None"}
        </Text>
        <Text style={styles.debugText}>
          NOAA Station ID: {noaaStationId || "None"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  contentContainer: {
    padding: 16,
  },
  dateHeader: {
    backgroundColor: blue[600],
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    color: white,
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
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  debugSection: {
    backgroundColor: gray[100],
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: gray[600],
  },
  debugText: {
    fontSize: 12,
    color: gray[500],
    marginBottom: 2,
  },
});

export default TideCard;
