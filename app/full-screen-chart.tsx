import { CardChart } from "@/components/CardChart";
import { white } from "@/constants/colors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FullScreenChart() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();

  // data is passed as a stringified JSON object
  const data = useMemo(() => {
    if (typeof params.data === "string") {
      return JSON.parse(params.data);
    }
  }, [params.data]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: params.title });
  }, [navigation, params.title]);

  const width = windowWidth - 20;
  const height = width * 0.9;

  return (
    <SafeAreaView style={styles.container}>
      {params.siteName && (
        <View style={styles.siteWrapper}>
          <Text style={styles.siteText}>{params.siteName}</Text>
        </View>
      )}
      <CardChart
        data={data}
        fullScreen
        width={width}
        height={height}
        showDirectionArrows={Boolean(params.showDirectionArrows)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: white,
    paddingTop: 20,
  },
  siteWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
  },
  siteText: { fontSize: 15 },
});
