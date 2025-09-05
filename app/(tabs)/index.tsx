import { AirTempCard } from "@/components/AirTempCard";
import { CardGrid } from "@/components/CardGrid";
import { SalinityCard } from "@/components/SalinityCard";
import { WaterTempCard } from "@/components/WaterTempCard";
import { WindCard } from "@/components/WindCard";
import { useLocationContext } from "@/context/LocationContext";
import { useSalinitySites } from "@/hooks/useSalinitySites";
import { useWaterTempSites } from "@/hooks/useWaterTempSites";
import { useWindSites } from "@/hooks/useWindSites";
import { useApolloClient } from "@apollo/client";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function NowScreen() {
  const { activeLocation } = useLocationContext();
  const apolloClient = useApolloClient();

  const windSites = useWindSites(activeLocation);
  const waterTempSites = useWaterTempSites(activeLocation);
  const salinitySites = useSalinitySites(activeLocation);

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
          <WindCard sites={windSites} location={activeLocation} />
          <AirTempCard location={activeLocation} />
          <WaterTempCard location={activeLocation} sites={waterTempSites} />
          <SalinityCard location={activeLocation} sites={salinitySites} />
        </CardGrid>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
