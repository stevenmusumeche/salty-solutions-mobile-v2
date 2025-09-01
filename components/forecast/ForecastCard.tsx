import React from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { white } from "../../constants/colors";
import {
  CombinedForecastV2DetailFragment,
  SolunarDetailFieldsFragment,
  SunDetailFieldsFragment,
  TideDetailFieldsFragment,
} from "../../graphql/generated";
import Teaser from "../Teaser";
import ForecastSun from "./ForecastSun";
import ForecastText from "./ForecastText";
import TideChart from "../TideChart";
import ForecastTimeBuckets from "./ForecastTimeBuckets";
import ForecastWindChart from "./ForecastWindChart";

interface Props {
  datum: CombinedForecastV2DetailFragment;
  tideStationName: string;
  tideData: TideDetailFieldsFragment[];
  sunData: SunDetailFieldsFragment[];
  dateString: string;
  refreshing: boolean;
  onRefresh: () => void;
  solunarData: SolunarDetailFieldsFragment[];
}

const ForecastCard: React.FC<Props> = ({
  datum,
  dateString,
  tideData,
  sunData,
  tideStationName,
  refreshing,
  onRefresh,
  solunarData,
}) => {
  const date = new Date(dateString);

  const { width } = useWindowDimensions();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ width }}>
        <View style={styles.cardWrapper}>
          <View style={styles.children}>
            <ForecastWindChart data={datum} date={date} />
            <ForecastTimeBuckets data={datum} date={date} />
            <TideChart
              tideData={tideData}
              stationName={tideStationName}
              date={date}
              sunData={sunData}
              solunarData={solunarData}
              showObserved={false}
            />
            <ForecastSun
              sunData={sunData}
              date={date}
              solunarData={solunarData}
            />
            <ForecastText day={datum.day} night={datum.night} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(ForecastCard);

export const TeaserForecastCard = () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.container}>
      <View style={{ width, flex: 1 }}>
        <Teaser
          title="Get the Full 9-Day Forecast"
          description={
            "Plan your perfect fishing trips with detailed weather, wind, and water conditions for the week ahead."
          }
        >
          <Image
            source={require("../../assets/images/forecast.jpg")}
            style={{
              width: width - 40,
              height: (width - 40) / 1.4,
              marginTop: 10,
              marginBottom: 10,
            }}
            resizeMode="stretch"
          />
        </Teaser>
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    flexGrow: 1,
    alignItems: "center",
  },
  container: {
    backgroundColor: white,
    flex: 1,
  },
  children: {
    flex: 1,
    width: "100%",
    flexGrow: 1,
  },
});
