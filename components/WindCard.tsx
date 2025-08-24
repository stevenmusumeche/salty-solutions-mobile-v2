import { blue } from "@/constants/colors";
import { useCurrentWindData } from "@/hooks/useCurrentWindData";
import { DataSite, LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BigBlue from "./BigBlue";
import { CardChart } from "./CardChart";
import { ConditionCard } from "./ConditionCard";
import { ErrorIcon } from "./FullScreenError";
import LoaderBlock from "./LoaderBlock";
import NoData from "./NoData";
import UsgsSiteSelect from "./UsgsSiteSelect";

interface Props {
  location: LocationDetail;
  sites: DataSite[];
  onLoad?: () => void;
}

export const WindCard: React.FC<Props> = ({ sites, location, onLoad }) => {
  const router = useRouter();
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
      onCompleted: onLoad,
    });

  if (loading) {
    return (
      <ConditionCard headerText={headerText}>
        <LoaderBlock />
      </ConditionCard>
    );
  }

  if (error) {
    return (
      <ConditionCard headerText={headerText}>
        <View style={styles.errorWrapper}>
          <ErrorIcon />
        </View>
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
          {curDetail && (
            <CardChart
              data={curDetail}
              showDirectionArrows
              onPress={() => {
                router.push({
                  pathname: "/full-screen-chart",
                  params: {
                    data: JSON.stringify(curDetail),
                    title: headerText,
                    siteName: selectedSite?.name,
                    showDirectionArrows: 1,
                  },
                });
              }}
            />
          )}
        </>
      ) : (
        <NoData />
      )}
      {selectedSite ? (
        <View style={styles.usgsWrapper}>
          <UsgsSiteSelect
            sites={sites}
            handleChange={(selectedSiteId) => {
              const match = sites.find((site) => site.id === selectedSiteId);
              if (!match) {
                return;
              }

              setSelectedSite(match);
            }}
            selectedId={selectedSite.id}
          />
        </View>
      ) : (
        <View style={styles.spacer} />
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
