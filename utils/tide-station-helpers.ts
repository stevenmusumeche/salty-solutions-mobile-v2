import { differenceInHours } from "date-fns";
import { useMemo } from "react";
import { 
  LocationDetailFragment, 
  NoaaParam, 
  UsgsParam,
  TideStationDetailFragment,
  UsgsSiteDetailFragment
} from "../graphql/generated";
import { DataSite } from "../context/TideContext";

const RECENT_HOURS_QUALIFIER = 48;

export const useTideStationSites = (location?: LocationDetailFragment): DataSite[] => {
  return useMemo(
    () =>
      getNoaaStationsWithParam(NoaaParam.TidePrediction, location).sort(
        sortOldDataLast
      ),
    [location]
  );
};

export const useWaterHeightSites = (location?: LocationDetailFragment): DataSite[] => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.GuageHeight, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.WaterLevel, location);
    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};

function sortOldDataLast(
  a: { hasRecentData: boolean },
  b: { hasRecentData: boolean }
) {
  if (a.hasRecentData && !b.hasRecentData) return -1;
  if (!a.hasRecentData && b.hasRecentData) return 1;
  return 0;
}

function getUsgsSitesWithParam(
  paramType: UsgsParam,
  location?: LocationDetailFragment
): DataSite[] {
  return (
    location?.usgsSites.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((site) => addUsgsRecencyData(site, paramType));
}

function getNoaaStationsWithParam(
  paramType: NoaaParam,
  location?: LocationDetailFragment
): DataSite[] {
  return (
    location?.tidePreditionStations.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((station) => addNoaaRecencyData(station, paramType));
}

function getUsgsParam(
  params: UsgsSiteDetailFragment["availableParamsV2"],
  paramType: UsgsParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

function getNoaaParam(
  params: TideStationDetailFragment["availableParamsV2"],
  paramType: NoaaParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

function addUsgsRecencyData(
  site: UsgsSiteDetailFragment,
  paramType: UsgsParam
): DataSite {
  const paramInfo = getUsgsParam(site.availableParamsV2, paramType);
  let hasRecentData = false;
  if (paramInfo && paramInfo.latestDataDate) {
    const latest = new Date(paramInfo.latestDataDate);
    hasRecentData =
      differenceInHours(new Date(), latest) < RECENT_HOURS_QUALIFIER;
  }
  return {
    ...site,
    name: site.name + (hasRecentData ? "" : " [no recent data]"),
    hasRecentData,
  };
}

function addNoaaRecencyData(
  station: TideStationDetailFragment,
  paramType: NoaaParam
): DataSite {
  const paramInfo = getNoaaParam(station.availableParamsV2, paramType);
  let hasRecentData = false;
  if (paramInfo && paramInfo.latestDataDate) {
    const latest = new Date(paramInfo.latestDataDate);
    hasRecentData =
      differenceInHours(new Date(), latest) < RECENT_HOURS_QUALIFIER;
  }
  return {
    ...station,
    name: station.name + (hasRecentData ? "" : " [no recent data]"),
    hasRecentData,
  };
}