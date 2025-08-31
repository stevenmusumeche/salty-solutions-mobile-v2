import { addDays, format, startOfDay, subDays } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useTideQuery } from "../graphql/generated";

interface UseTideDataParams {
  locationId?: string;
  tideStationId?: string;
  date: Date;
  usgsSiteId?: string;
  noaaStationId?: string;
  skip?: boolean;
}

export const useTideData = ({
  locationId,
  tideStationId,
  date,
  usgsSiteId,
  noaaStationId,
  skip = false,
}: UseTideDataParams) => {
  const [refreshing, setRefreshing] = useState(false);

  // Calculate 4-day window: 1 day before to 2 days after the selected date
  const startDate = subDays(startOfDay(date), 1);
  const endDate = addDays(startOfDay(date), 2);

  // Format dates to ISO with timezone for GraphQL
  const startDateString = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const endDateString = format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const { data, loading, error, refetch } = useTideQuery({
    variables: {
      locationId: locationId || "",
      tideStationId: tideStationId || "",
      usgsSiteId: usgsSiteId,
      includeUsgs: !!usgsSiteId,
      noaaStationId: noaaStationId,
      includeNoaa: !!noaaStationId,
      startDate: startDateString,
      endDate: endDateString,
    },
    skip: skip || !locationId || !tideStationId,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Tide refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return useMemo(() => {
    const tideData = data?.tidePreditionStation?.tides || [];
    const sunData = data?.location?.sun || [];
    const moonData = data?.location?.moon || [];
    const solunarData = data?.location?.solunar || [];
    const waterHeightData =
      data?.usgsSite?.waterHeight || data?.noaaWaterHeight?.waterHeight || [];
    const tideStationName = data?.tidePreditionStation?.id || "";
    const waterHeightSiteName = data?.usgsSite?.name || "";

    return {
      tideData,
      sunData,
      moonData,
      solunarData,
      waterHeightData,
      tideStationName,
      waterHeightSiteName,
      loading,
      error,
      refreshing,
      handleRefresh,
    };
  }, [data, loading, error, refreshing, handleRefresh]);
};
