import { NoaaParam, UsgsParam } from "@/graphql/generated";
import {
  LocationDetail,
  Maybe,
  TideStationDetail,
  UsgsSiteDetail,
} from "@/types";
import { differenceInHours } from "date-fns";

const RECENT_HOURS_QUALIFIER = 48;

export function sortOldDataLast(
  a: { hasRecentData: boolean },
  b: { hasRecentData: boolean }
) {
  if (a.hasRecentData && !b.hasRecentData) return -1;
  if (!a.hasRecentData && b.hasRecentData) return 1;
  return 0;
}

export function getUsgsSitesWithParam(
  paramType: UsgsParam,
  location?: Maybe<LocationDetail>
) {
  return (
    location?.usgsSites.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((site) => addUsgsRecencyData(site, paramType));
}

export function getNoaaStationsWithParam(
  paramType: NoaaParam,
  location?: Maybe<LocationDetail>
) {
  return (
    location?.tidePreditionStations.filter((site) =>
      site.availableParamsV2.map((x) => x.id).includes(paramType)
    ) || []
  ).map((station) => addNoaaRecencyData(station, paramType));
}

function addUsgsRecencyData(site: UsgsSiteDetail, paramType: UsgsParam) {
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

function addNoaaRecencyData(station: TideStationDetail, paramType: NoaaParam) {
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

function getUsgsParam(
  params: UsgsSiteDetail["availableParamsV2"],
  paramType: UsgsParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

function getNoaaParam(
  params: TideStationDetail["availableParamsV2"],
  paramType: NoaaParam
) {
  return params.filter((paramInfo) => paramInfo.id === paramType)[0];
}

export function noDecimals(x: number) {
  return x.toFixed(0);
}

export function oneDecimal(x: number) {
  return x.toFixed(1);
}
