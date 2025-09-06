import { gql } from '@apollo/client';

export const COMPLETE_PURCHASE_V2_MUTATION = gql`
  mutation CompletePurchaseV2($input: CompletePurchaseV2Input!) {
    completePurchaseV2(input: $input) {
      isComplete
      user {
        id
        email
        name
        picture
        createdAt
        entitledToPremium
      }
    }
  }
`;