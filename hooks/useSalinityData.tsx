import {
  CurrentConditionsDataQuery,
  useCurrentConditionsDataQuery,
} from "@/graphql/generated";
import { noDecimals } from "./util";

export function useSalinityData(
  locationId: string,
  usgsSiteId: string,
  startDate: Date,
  endDate: Date
) {
  const { data, refetch, loading, error } = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId,
      includeUsgs: true,
      includeNoaa: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    notifyOnNetworkStatusChange: true,
  });
  const { curValue, curDetail, stationName } = extractData(data);
  return {
    curValue,
    curDetail,
    stationName,
    refresh: refetch,
    loading,
    error,
    ...data,
  };
}

function extractData(data?: CurrentConditionsDataQuery) {
  const curValue = data?.usgsSite?.salinity?.summary?.mostRecent
    ? noDecimals(data.usgsSite.salinity.summary.mostRecent.salinity)
    : null;

  const curDetail = data?.usgsSite?.salinity?.detail?.map((data) => ({
    y: data.salinity,
    // x: data.timestamp,
    x: new Date(data.timestamp).getTime(),
  }));

  const stationName = data?.usgsSite?.name;

  return { curValue, curDetail, stationName };
}
