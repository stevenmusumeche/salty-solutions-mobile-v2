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

export default function NowScreen() {
  const { activeLocation } = useLocationContext();
  const apolloClient = useApolloClient();

  const windSites = useWindSites(activeLocation);
  const waterTempSites = useWaterTempSites(activeLocation);
  const salinitySites = useSalinitySites(activeLocation);

  if (!activeLocation) return null;

  return (
    <View style={styles.container}>
      {/* <Pressable
        onPress={() => {
          apolloClient.refetchQueries({ include: ["CurrentConditionsData"] });
        }}
      >
        <Text>Press me</Text>
      </Pressable> */}
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
