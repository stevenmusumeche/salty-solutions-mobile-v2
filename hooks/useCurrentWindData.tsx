import {
  CurrentConditionsDataQuery,
  useCurrentConditionsDataQuery,
} from "@/graphql/generated";
import { noDecimals } from "./util";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  usgsSiteId?: string;
  noaaStationId?: string;
}
export function useCurrentWindData({
  locationId,
  startDate,
  endDate,
  usgsSiteId,
  noaaStationId,
}: Input) {
  const includeUsgs = !!usgsSiteId;
  const includeNoaa = !!noaaStationId;
  const includeLocationWind = !includeUsgs && !includeNoaa;
  const { data, refetch, loading, error } =
    useCurrentConditionsDataQuery({
      variables: {
        locationId,
        usgsSiteId,
        includeUsgs,
        includeLocationWind,
        noaaStationId,
        includeNoaa,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      notifyOnNetworkStatusChange: true,
    });

  const { curValue, curDirectionValue, curDetail } = extractData(data);

  return {
    curValue,
    curDirectionValue,
    curDetail,
    refresh: refetch,
    loading,
    error,
    ...data,
  };
}

function extractData(windData?: CurrentConditionsDataQuery) {
  // use either the USGS or the NOAA field (or location fallback), depending on which was requested
  const base =
    windData?.usgsSite?.wind ||
    windData?.tidePreditionStation?.wind ||
    windData?.location?.locationWind;

  const curValue =
    base?.summary.mostRecent && noDecimals(base?.summary.mostRecent.speed);

  const curDirectionValue = base?.summary?.mostRecent?.direction;

  const curDetail =
    base?.detail &&
    base?.detail
      .map((data) => ({
        y: data.speed,
        // x: data.timestamp,
        x: new Date(data.timestamp).getTime(),
        directionDegrees: data.directionDegrees,
        direction: data.direction,
      }))
      .sort((a, b) => {
        return new Date(a.x).getTime() - new Date(b.x).getTime();
      });

  return { curValue, curDirectionValue, curDetail };
}
