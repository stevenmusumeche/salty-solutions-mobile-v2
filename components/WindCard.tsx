import { blue } from "@/constants/colors";
import { useCurrentWindData } from "@/hooks/useCurrentWindData";
import { DataSite, LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSiteSelectionContext } from "../context/SiteSelectionContext";
import BigBlue from "./BigBlue";
import { CardChart } from "./CardChart";
import { ConditionCard } from "./ConditionCard";
import { ErrorIcon } from "./FullScreenError";
import LoaderBlock from "./LoaderBlock";
import NoData from "./NoData";
import { SiteDisplay } from "./SiteDisplay";

interface Props {
  location: LocationDetail;
  sites: DataSite[];
}

export const WindCard: React.FC<Props> = ({ sites, location }) => {
  const router = useRouter();
  const headerText = "Wind Speed (mph)";
  const { selectedSites, actions } = useSiteSelectionContext();

  // Get selected site from context, fallback to first site if none selected
  const selectedSite =
    selectedSites.wind && sites.find((s) => s.id === selectedSites.wind?.id)
      ? selectedSites.wind
      : sites.length
      ? sites[0]
      : undefined;

  // Initialize context with default site if none selected
  useEffect(() => {
    if (!selectedSites.wind && sites.length > 0) {
      actions.setSelectedSite("wind", sites[0]);
    }
  }, [sites, selectedSites.wind, actions]);

  const date = useMemo(() => new Date(), []);
  const { curValue, curDirectionValue, loading, curDetail, error } =
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
          <SiteDisplay
            selectedSite={selectedSite}
            onChangePress={() => {
              router.push({
                pathname: "/site-selector-modal",
                params: {
                  sites: JSON.stringify(sites),
                  selectedId: selectedSite.id,
                  componentType: "wind",
                },
              });
            }}
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
