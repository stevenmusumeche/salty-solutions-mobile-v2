import {
  CurrentConditionsDataQuery,
  useCurrentConditionsDataQuery,
} from "@/graphql/generated";

interface Input {
  locationId: string;
  startDate: Date;
  endDate: Date;
  noaaStationId?: string;
}
export function useTemperatureData({
  locationId,
  startDate,
  endDate,
  noaaStationId,
}: Input) {
  const includeNoaa = !!noaaStationId;

  const { data, refetch, loading, error } = useCurrentConditionsDataQuery({
    variables: {
      locationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      noaaStationId,
      includeNoaa,
      includeUsgs: false,
    },
    notifyOnNetworkStatusChange: true,
  });
  const { curValue, curDetail } = extractData(data);
  return { curValue, curDetail, refresh: refetch, loading, error, ...data };
}

function extractData(tempData?: CurrentConditionsDataQuery) {
  // use either the NOAA or location field, depending on which was requested
  const base =
    tempData?.tidePreditionStation?.temperature ||
    tempData?.location?.temperature;

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
