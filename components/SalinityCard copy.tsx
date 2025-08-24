import { useNavigation } from "@react-navigation/native";
import { subHours } from "date-fns";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import BigBlue from "./BigBlue";
import LoaderBlock from "./LoaderBlock";
import NoData from "./NoData";
import { useLocationContext } from "@/context/LocationContext";
import { useTemperatureData } from "@/hooks/useTemperatureData";
import { DataSite, LocationDetail } from "@/types";
import { ConditionCard } from "./ConditionCard";
import { ErrorIcon } from "./FullScreenError";
import { CardChart } from "./CardChart";
import { useRouter } from "expo-router";
import { useWaterTemperatureData } from "@/hooks/useWaterTemperatureData";
import UsgsSiteSelect from "./UsgsSiteSelect";
import { useSalinityData } from "@/hooks/useSalinityData";

interface Props {
  location: LocationDetail;
  sites: DataSite[];
}

export const SalinityCard: React.FC<Props> = ({ location, sites }) => {
  const headerText = "Salinity";
  const router = useRouter();

  const [selectedSite, setSelectedSite] = useState(() =>
    sites.length ? sites[0] : undefined
  );

  useEffect(() => {
    setSelectedSite(sites.length ? sites[0] : undefined);
  }, [sites]);

  const date = useMemo(() => new Date(), []);
  const { curValue, curDetail, loading, error, refresh } = useSalinityData(
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
