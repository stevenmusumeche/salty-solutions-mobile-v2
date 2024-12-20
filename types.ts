import {
  LocationDetailFragment,
  TideStationDetailFragment,
  UsgsSiteDetailFragment,
} from "./graphql/generated";

export type LocationDetail = LocationDetailFragment;
export type UsgsSiteDetail = UsgsSiteDetailFragment;
export type TideStationDetail = TideStationDetailFragment;
export type DataSite = UsgsSiteDetail | TideStationDetail;
export type Maybe<T> = T | null;
