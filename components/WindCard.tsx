import { blue } from "@/colors";
import { useLocationContext } from "@/context/LocationContext";
import { useCurrentWindData } from "@/hooks/useCurrentWindData";
import { DataSite, LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ConditionCard } from "./ConditionCard";
import LoaderBlock from "./LoaderBlock";
import BigBlue from "./BigBlue";
import NoData from "./NoData";

interface Props {
  location: LocationDetail;
  sites: DataSite[];
}

export const WindCard: React.FC<Props> = ({ sites, location }) => {
  const headerText = "Wind Speed (mph)";

  const [selectedSite, setSelectedSite] = useState(() =>
    sites.length ? sites[0] : undefined
  );

  useEffect(() => {
    setSelectedSite(sites.length ? sites[0] : undefined);
  }, [sites]);

  const date = useMemo(() => new Date(), []);
  const { curValue, curDirectionValue, loading, curDetail, error, refresh } =
    useCurrentWindData({
      locationId: location.id,
      startDate: subHours(date, 48),
      endDate: date,
      usgsSiteId:
        selectedSite && selectedSite.__typename === "UsgsSite"
          ? selectedSite.id
          : undefined,
      noaaStationId:
        selectedSite && selectedSite.__typename === "TidePreditionStation"
          ? selectedSite.id
          : undefined,
    });

  if (loading) {
    return (
      <ConditionCard headerText={headerText}>
        <LoaderBlock />
      </ConditionCard>
    );
  }

  return (
    <ConditionCard headerText={headerText}>
      {curValue ? (
        <>
          <BigBlue>{curValue}</BigBlue>
          <View style={styles.directionWrapper}>
            <Text style={styles.directionText}>{curDirectionValue}</Text>
          </View>
        </>
      ) : (
        <NoData />
      )}
    </ConditionCard>
  );
};

const styles = StyleSheet.create({
  directionWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  directionText: {
    color: blue[800],
    fontSize: 18,
  },
  errorWrapper: {
    justifyContent: "center",
    flex: 1,
  },
  usgsWrapper: {
    marginTop: 10,
    width: "100%",
  },
  spacer: {
    height: 19.3,
    width: 50,
    marginTop: 10,
  },
});
