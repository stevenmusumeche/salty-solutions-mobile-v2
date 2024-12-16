import { gray, white } from "@/colors";
import { AirTempCard } from "@/components/AirTempCard";
import { WaterTempCard } from "@/components/WaterTempCard";
import { CardGrid } from "@/components/CardGrid";
import { WindCard } from "@/components/WindCard";
import { useLocationContext } from "@/context/LocationContext";
import { useWindSites } from "@/hooks/useWindSites";
import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useWaterTempSites } from "@/hooks/useWaterTempSites";
import { useSalinitySites } from "@/hooks/useSalinitySites";
import { SalinityCard } from "@/components/SalinityCard";
import { Pressable, RefreshControl } from "react-native-gesture-handler";
import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useInterval } from "usehooks-ts";

export default function NowScreen() {
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [lastUpdatedText, setLastUpdatedText] = useState<string>();
  const { activeLocation } = useLocationContext();
  const apolloClient = useApolloClient();

  const windSites = useWindSites(activeLocation);
  const waterTempSites = useWaterTempSites(activeLocation);
  const salinitySites = useSalinitySites(activeLocation);

  useInterval(() => {
    if (lastUpdated) {
      setLastUpdatedText(formatDistanceToNow(lastUpdated, { addSuffix: true }));
    }
  }, 60000);

  if (!activeLocation) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() =>
              apolloClient.refetchQueries({
                include: ["CurrentConditionsData"],
              })
            }
          />
        }
      >
        <CardGrid>
          <WindCard
            sites={windSites}
            location={activeLocation}
            onLoad={() => {
              const now = new Date();
              setLastUpdatedText(formatDistanceToNow(now, { addSuffix: true }));
              setLastUpdated(now);
            }}
          />
          <AirTempCard location={activeLocation} />
          <WaterTempCard location={activeLocation} sites={waterTempSites} />
          <SalinityCard location={activeLocation} sites={salinitySites} />
        </CardGrid>
        {lastUpdatedText ? (
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Updated {lastUpdatedText}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  lastUpdated: {
    alignItems: "center",
    marginBlock: 5,
  },
  lastUpdatedText: {
    color: gray[600],
    fontSize: 12,
  },
});
