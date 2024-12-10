import { gray, white } from "@/colors";
import { AirTempCard } from "@/components/AirTempCard";
import { WaterTempCard } from "@/components/WaterTempCard";
import { CardGrid } from "@/components/CardGrid";
import { WindCard } from "@/components/WindCard";
import { useLocationContext } from "@/context/LocationContext";
import { useWindSites } from "@/hooks/useWindSites";
import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useWaterTempSites } from "@/hooks/useWaterTempSites";

export default function NowScreen() {
  const { activeLocation } = useLocationContext();

  const windSites = useWindSites(activeLocation);
  const waterTempSites = useWaterTempSites(activeLocation);

  if (!activeLocation) return null;

  return (
    <View style={styles.container}>
      <CardGrid>
        <WindCard sites={windSites} location={activeLocation} />
        <AirTempCard location={activeLocation} />
        <WaterTempCard location={activeLocation} sites={waterTempSites} />
      </CardGrid>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
