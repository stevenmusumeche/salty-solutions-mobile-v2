import { NoaaParam, UsgsParam } from "@/graphql/generated";
import { LocationDetail, Maybe } from "@/types";
import { useMemo } from "react";
import {
  getNoaaStationsWithParam,
  getUsgsSitesWithParam,
  sortOldDataLast,
} from "./util";

export const useWindSites = (location?: Maybe<LocationDetail>) => {
  return useMemo(() => {
    const usgs = getUsgsSitesWithParam(UsgsParam.WindSpeed, location);
    const noaa = getNoaaStationsWithParam(NoaaParam.Wind, location);

    return [...usgs, ...noaa].sort(sortOldDataLast);
  }, [location]);
};
