import { gql } from '@apollo/client';

const SalinityMapQuery = gql(/* GraphQL */ `
  query SalinityMap($locationId: ID!) {
    location(id: $locationId) {
      id
      salinityMap
    }
  }
`);