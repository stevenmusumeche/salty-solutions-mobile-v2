import { gql } from "@apollo/client";

export const SUN_DETAIL_FIELDS = gql`
  fragment SunDetailFields on SunDetail {
    sunrise
    sunset
    dawn
    dusk
    nauticalDawn
    nauticalDusk
  }
`;