import { gql } from "@apollo/client";

export const SOLUNAR_PERIOD_FIELDS = gql`
  fragment SolunarPeriodFields on SolunarPeriod {
    start
    end
    weight
  }
`;