import { useSalinityData } from "@/hooks/useSalinityData";
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

export const SalinityCard: React.FC<Props> = ({ location, sites }) => {
  const headerText = "Salinity";
  const router = useRouter();
  const { selectedSites, actions } = useSiteSelectionContext();

  // Get selected site from context, fallback to first site if none selected  
  const selectedSite = selectedSites.salinity && sites.find(s => s.id === selectedSites.salinity?.id) 
    ? selectedSites.salinity 
    : sites.length ? sites[0] : undefined;

  // Initialize context with default site if none selected
  useEffect(() => {
    if (!selectedSites.salinity && sites.length > 0) {
      actions.setSelectedSite('salinity', sites[0]);
    }
  }, [sites, selectedSites.salinity, actions]);

  const date = useMemo(() => new Date(), []);
  const { curValue, curDetail, loading, error } = useSalinityData(
    location.id,
    selectedSite?.id ?? "",
    subHours(date, 48),
    date
  );

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
                  pathname: "/full-screen-chart",
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
            onChangePress={() => {
              router.push({
                pathname: "/site-selector-modal",
                params: {
                  sites: JSON.stringify(sites),
                  selectedId: selectedSite.id,
                  componentType: "salinity",
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
