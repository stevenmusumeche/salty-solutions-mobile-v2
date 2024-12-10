import { UsgsParam } from "@/graphql/generated";
import { LocationDetail, Maybe } from "@/types";
import { useMemo } from "react";
import { getUsgsSitesWithParam, sortOldDataLast } from "./util";

export const useSalinitySites = (location?: Maybe<LocationDetail>) => {
  return useMemo(() => {
    return getUsgsSitesWithParam(UsgsParam.Salinity, location).sort(
      sortOldDataLast
    );
  }, [location]);
};
