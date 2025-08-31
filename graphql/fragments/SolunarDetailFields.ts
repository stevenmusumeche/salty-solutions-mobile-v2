import { gql } from "@apollo/client";
import { SOLUNAR_PERIOD_FIELDS } from "./SolunarPeriodFields";

export const SOLUNAR_DETAIL_FIELDS = gql`
  ${SOLUNAR_PERIOD_FIELDS}

  fragment SolunarDetailFields on SolunarDetail {
    date
    score
    majorPeriods {
      ...SolunarPeriodFields
    }
    minorPeriods {
      ...SolunarPeriodFields
    }
  }
`;