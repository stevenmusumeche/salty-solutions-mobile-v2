import { gql } from "@apollo/client";

const UpsertUserMutation = gql`
  mutation UpsertUser($input: UpsertUserInput!) {
    upsertUser(input: $input) {
      user {
        ...UserFields
      }
    }
  }

  fragment UserFields on User {
    id
    email
    name
    picture
    createdAt
    entitledToPremium
  }
`;

export default UpsertUserMutation;