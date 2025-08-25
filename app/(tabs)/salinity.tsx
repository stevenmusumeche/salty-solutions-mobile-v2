import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import FullScreenError from "@/components/FullScreenError";
import LoaderBlock from "@/components/LoaderBlock";
import RemoteImage from "@/components/RemoteImage";
import { gray, red, white } from "@/constants/colors";
import { useLocationContext } from "@/context/LocationContext";
import { useSalinityMapQuery } from "@/graphql/generated";

export default function SalinityScreen() {
  const { activeLocation } = useLocationContext();
  const { width: windowWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    loading: fetching,
    error,
    refetch,
  } = useSalinityMapQuery({
    variables: { locationId: activeLocation?.id ?? "" },
    skip: !activeLocation?.id,
  });

  const mapUrl = data?.location?.salinityMap ?? "";

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (refreshing && !fetching) {
      setRefreshing(false);
    }
  }, [refreshing, fetching]);

  if (error) {
    return <FullScreenError />;
  }

  if (!activeLocation) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {fetching ? (
        <LoaderBlock styles={{ ...styles.loaderBlock, height: 300 }} />
      ) : (
        <View>
          {mapUrl ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/salinity-detail",
                    params: {
                      imageUrl: mapUrl,
                      title: "Zoomable Salinity Map",
                    },
                  })
                }
              >
                <View style={styles.imageContainer}>
                  <RemoteImage
                    imageUrl={mapUrl}
                    desiredWidth={windowWidth - 60}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.zoomText}>
                Press image to open zoomable view
              </Text>
            </>
          ) : (
            <Text style={{ textAlign: "center", color: red["700"] }}>
              Salinity map not available for {activeLocation.name}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    backgroundColor: white,
    padding: 10,
    borderWidth: 1,
    borderColor: gray["300"],
    alignItems: "center",
    justifyContent: "center",
  },
  loaderBlock: {
    backgroundColor: gray[400],
    width: "100%",
    marginBottom: 20,
    borderRadius: 8,
  },
  zoomText: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: gray[700],
    fontSize: 14,
  },
});
