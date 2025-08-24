import {
  CurrentConditionsDataQuery,
  useCurrentConditionsDataQuery,
} from "@/graphql/generated";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  usgsSiteId?: string;
  noaaStationId?: string;
}

export function useWaterTemperatureData({
  locationId,
  usgsSiteId,
  noaaStationId,
  startDate,
  endDate,
}: Input) {
  const includeUsgs = !!usgsSiteId;
  const includeNoaa = !!noaaStationId;

  const { data, refetch, loading, error } = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      usgsSiteId,
      includeUsgs,
      noaaStationId,
      includeNoaa,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    notifyOnNetworkStatusChange: true,
  });

  const { curValue, curDetail } = extractData(data);
  return { curValue, curDetail, refresh: refetch, loading, error, ...data };
}

function extractData(data?: CurrentConditionsDataQuery) {
  // use either the USGS or the NOAA field, depending on which was requested
  const base =
    data?.usgsSite?.waterTemperature ||
    data?.tidePreditionStation?.waterTemperature;

  const curValue =
    base?.summary?.mostRecent &&
    `${Math.round(base.summary.mostRecent.temperature.degrees)}°`;

  const curDetail = base?.detail?.map((data) => ({
    y: data.temperature.degrees,
    // x: data.timestamp,
    x: new Date(data.timestamp).getTime(),
  }));

  return { curValue, curDetail };
}
