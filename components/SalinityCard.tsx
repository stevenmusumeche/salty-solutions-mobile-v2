import { useSalinityData } from "@/hooks/useSalinityData";
import { DataSite, LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
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
