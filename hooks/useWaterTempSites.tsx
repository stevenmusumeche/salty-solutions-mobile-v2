import { NoaaParam, UsgsParam } from "@/graphql/generated";
import { LocationDetail, Maybe } from "@/types";
import { useMemo } from "react";
import {
  getNoaaStationsWithParam,
  getUsgsSitesWithParam,
  sortOldDataLast,
} from "./util";

export const useWaterTempSites = (location?: Maybe<LocationDetail>) => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.WaterTemp, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.WaterTemperature, location);
    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};
