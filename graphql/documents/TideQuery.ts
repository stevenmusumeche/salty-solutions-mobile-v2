import { gql } from "@apollo/client";
import { TIDE_DETAIL_FIELDS } from "../fragments/TideDetailFields";
import { SUN_DETAIL_FIELDS } from "../fragments/SunDetailFields";
import { SOLUNAR_DETAIL_FIELDS } from "../fragments/SolunarDetailFields";

export const TIDE_QUERY = gql`
  ${TIDE_DETAIL_FIELDS}
  ${SUN_DETAIL_FIELDS}
  ${SOLUNAR_DETAIL_FIELDS}
  query Tide(
    $locationId: ID!
    $tideStationId: ID!
    $usgsSiteId: ID
    $includeUsgs: Boolean!
    $noaaStationId: ID
    $includeNoaa: Boolean!
    $startDate: String!
    $endDate: String!
  ) {
    tidePreditionStation(stationId: $tideStationId) {
      id
      name
      tides(start: $startDate, end: $endDate) {
        ...TideDetailFields
      }
    }
    usgsSite(siteId: $usgsSiteId) @include(if: $includeUsgs) {
      ...UsgsSiteFields
    }
    noaaWaterHeight: tidePreditionStation(stationId: $noaaStationId)
      @include(if: $includeNoaa) {
      id
      name
      waterHeight(start: $startDate, end: $endDate) {
        ...WaterHeightFields
      }
    }
    location(id: $locationId) {
      id
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
      moon(start: $startDate, end: $endDate) {
        ...MoonDetailFields
      }
      solunar(start: $startDate, end: $endDate) {
        ...SolunarDetailFields
      }
    }
  }

  fragment UsgsSiteFields on UsgsSite {
    id
    name
    waterHeight(start: $startDate, end: $endDate) {
      ...WaterHeightFields
    }
  }

  fragment WaterHeightFields on WaterHeight {
    timestamp
    height
  }

  fragment MoonDetailFields on MoonDetail {
    date
    phase
    illumination
  }

`;