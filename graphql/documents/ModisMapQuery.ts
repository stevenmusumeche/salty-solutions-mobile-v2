import { gql } from "@apollo/client";

export const MODIS_MAP_QUERY = gql`
  query ModisMap($locationId: ID!) {
    location(id: $locationId) {
      id
      modisMaps(numDays: 8) {
        date
        satellite
        small {
          url
          width
          height
        }
        large {
          url
          width
          height
        }
      }
    }
  }
`;