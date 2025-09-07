import { useTemperatureData } from "@/hooks/useTemperatureData";
import { LocationDetail } from "@/types";
import { subHours } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import BigBlue from "./BigBlue";
import { CardChart } from "./CardChart";
import { ConditionCard } from "./ConditionCard";
import { ErrorIcon } from "./FullScreenError";
import LoaderBlock from "./LoaderBlock";
import NoData from "./NoData";

interface Props {
  location: LocationDetail;
}

export const AirTempCard: React.FC<Props> = ({ location }) => {
  const headerText = "Air Temperature (F)";
  const router = useRouter();

  const date = useMemo(() => new Date(), []);
  const { curValue, curDetail, loading, error, refresh } = useTemperatureData({
    locationId: location.id,
    startDate: subHours(date, 48),
    endDate: date,
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
                  },
                });
              }}
            />
          )}
        </>
      ) : (
        <NoData />
      )}
      <View style={styles.spacer} />
    </ConditionCard>
  );
};

const styles = StyleSheet.create({
  errorWrapper: {
    justifyContent: "center",
    flex: 1,
  },
  spacer: {
    height: 31,
    width: 50,
    marginTop: 10,
  },
});
