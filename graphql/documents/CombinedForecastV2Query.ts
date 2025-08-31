import { gql } from "@apollo/client";

import { SOLUNAR_DETAIL_FIELDS } from "../fragments/SolunarDetailFields";
import { SUN_DETAIL_FIELDS } from "../fragments/SunDetailFields";
import { TIDE_DETAIL_FIELDS } from "../fragments/TideDetailFields";

export const COMBINED_FORECAST_V2_QUERY = gql`
  ${TIDE_DETAIL_FIELDS}
  ${SUN_DETAIL_FIELDS}
  ${SOLUNAR_DETAIL_FIELDS}
  query CombinedForecastV2(
    $locationId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    location(id: $locationId) {
      id
      combinedForecastV2(start: $startDate, end: $endDate) {
        ...CombinedForecastV2Detail
      }
      tidePreditionStations(limit: 1) {
        id
        name
        tides(start: $startDate, end: $endDate) {
          ...TideDetailFields
        }
      }
      sun(start: $startDate, end: $endDate) {
        ...SunDetailFields
      }
      solunar(start: $startDate, end: $endDate) {
        ...SolunarDetailFields
      }
    }
  }

  fragment CombinedForecastV2Detail on CombinedForecastV2 {
    name
    date
    wind {
      timestamp
      base
      gusts
      direction {
        text
        degrees
      }
    }
    day {
      short
      detailed
      marine
    }
    night {
      short
      detailed
      marine
    }
    temperature {
      timestamp
      temperature {
        degrees
      }
    }
    rain {
      timestamp
      mmPerHour
    }
  }
`;
