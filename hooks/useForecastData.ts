import { addDays, endOfDay, startOfDay } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useCombinedForecastV2Query } from "../graphql/generated";

const NUM_DAYS_PREMIUM = 9;
const NUM_DAYS_FREE = 2;

interface UseForecastDataParams {
  locationId?: string;
  isEntitledToPremium: boolean;
}

export const useForecastData = ({
  locationId,
  isEntitledToPremium,
}: UseForecastDataParams) => {
  const [refreshing, setRefreshing] = useState(false);

  const numDays = isEntitledToPremium ? NUM_DAYS_PREMIUM : NUM_DAYS_FREE;

  const { data, loading, error, refetch } = useCombinedForecastV2Query({
    variables: {
      locationId: locationId || "",
      startDate: startOfDay(new Date()).toISOString(),
      endDate: addDays(endOfDay(new Date()), numDays).toISOString(),
    },
    skip: !locationId,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return useMemo(
    () => {
      const forecastData =
        data?.location?.combinedForecastV2?.slice(0, numDays) || [];
      const sunData = data?.location?.sun || [];
      const tideData = data?.location?.tidePreditionStations?.[0]?.tides || [];
      const solunarData = data?.location?.solunar || [];
      const tideStationName =
        data?.location?.tidePreditionStations?.[0]?.name || "";

      return {
        forecastData,
        sunData,
        tideData,
        solunarData,
        tideStationName,
        loading,
        error,
        refreshing,
        handleRefresh,
        numDays,
      };
    },
    [data, numDays, loading, error, refreshing, handleRefresh]
  );
};
