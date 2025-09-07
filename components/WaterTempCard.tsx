import { useWaterTemperatureData } from "@/hooks/useWaterTemperatureData";
import { DataSite, LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
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

export const WaterTempCard: React.FC<Props> = ({ location, sites }) => {
  const headerText = "Water Temperature (F)";
  const router = useRouter();
  const { selectedSites, actions } = useSiteSelectionContext();

  // Get selected site from context, fallback to first site if none selected
  const selectedSite =
    selectedSites["water-temp"] &&
    sites.find((s) => s.id === selectedSites["water-temp"]?.id)
      ? selectedSites["water-temp"]
      : sites.length
      ? sites[0]
      : undefined;

  // Initialize context with default site if none selected
  useEffect(() => {
    if (!selectedSites["water-temp"] && sites.length > 0) {
      actions.setSelectedSite("water-temp", sites[0]);
    }
  }, [sites, selectedSites, actions]);

  const date = useMemo(() => new Date(), []);
  const { curValue, curDetail, loading, error } = useWaterTemperatureData({
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
          {curDetail && (
            <CardChart
              data={curDetail}
              onPress={() => {
                router.push({
                  pathname: "/full-screen-chart", // This should match your file structure
                  params: {
                    data: JSON.stringify(curDetail),
                    title: headerText,
                    siteName: selectedSite?.name,
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
            enableEdit={sites.length > 1}
            onChangePress={() => {
              router.push({
                pathname: "/site-selector-modal",
                params: {
                  sites: JSON.stringify(sites),
                  selectedId: selectedSite.id,
                  componentType: "water-temp",
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
