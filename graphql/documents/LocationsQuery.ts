import { gql } from "@apollo/client";

const LocationsQuery = gql(/* GraphQL */ `
  query Locations {
    locations {
      ...LocationDetail
    }
  }

  fragment LocationDetail on Location {
    id
    name
    state
    coords {
      lat
    }
    tidePreditionStations {
      ...TideStationDetail
    }
    usgsSites {
      ...UsgsSiteDetail
    }
  }

  fragment TideStationDetail on TidePreditionStation {
    id
    name
    availableParamsV2 {
      id
      latestDataDate
    }
    url
  }

  fragment UsgsSiteDetail on UsgsSite {
    id
    name
    availableParamsV2 {
      id
      latestDataDate
    }
    url
  }
`);
