import { brandYellow30, gray, white } from "@/constants/colors";
import { useLocationContext } from "@/context/LocationContext";
import { useLocationsQuery } from "@/graphql/generated";
import { LocationDetail } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationSwitcher() {
  const router = useRouter();
  const { activeLocation, setActiveLocation } = useLocationContext();
  const { data, loading, error } = useLocationsQuery();

  const handleLocationSelection = async (location: LocationDetail) => {
    setActiveLocation(location);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={data?.locations}
        keyExtractor={(location) => location.id}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Footer}
        renderItem={({ item: location }) => {
          const isActive = location.id === activeLocation?.id;
          return (
            <TouchableOpacity onPress={() => handleLocationSelection(location)}>
              <View
                style={[
                  styles.listItem,
                  { backgroundColor: isActive ? brandYellow30 : "white" },
                ]}
              >
                <Text
                  style={[
                    styles.listItemText,
                    { fontWeight: isActive ? "bold" : "normal" },
                  ]}
                >
                  {location.name}
                </Text>
                <View>
                  <MaterialIcons
                    name={isActive ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color={isActive ? gray[800] : gray[600]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const Separator = () => <View style={styles.separator} />;

const Footer = () => <View style={styles.footer} />;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: white,
  },
  list: {
    marginTop: 0,
    width: "100%",
  },
  listItem: {
    backgroundColor: white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: gray[300],
  },
  footer: {
    height: 1,
    backgroundColor: gray[400],
  },
  cancelWrapper: {
    paddingVertical: 5,
    width: "100%",
    backgroundColor: white,
  },
});
