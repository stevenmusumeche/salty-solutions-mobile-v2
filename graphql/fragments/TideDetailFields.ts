import { gql } from "@apollo/client";

export const TIDE_DETAIL_FIELDS = gql`
  fragment TideDetailFields on TideDetail {
    time
    height
    type
  }
`;