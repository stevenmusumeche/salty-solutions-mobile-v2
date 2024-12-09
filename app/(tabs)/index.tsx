import { gray, white } from "@/colors";
import { CardGrid } from "@/components/CardGrid";
import { WindCard } from "@/components/WindCard";
import { useLocationContext } from "@/context/LocationContext";
import { useWindSites } from "@/hooks/useWindSites";
import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NowScreen() {
  const { activeLocation } = useLocationContext();

  const windSites = useWindSites(activeLocation);

  if (!activeLocation) return null;

  return (
    <View style={styles.container}>
      <CardGrid>
        <WindCard sites={windSites} location={activeLocation} />
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
