import { gql } from "@apollo/client";

const UserLoggedInMutation = gql`
  mutation UserLoggedIn($platform: Platform!) {
    userLoggedIn(input: {platform: $platform}) {
      success
    }
  }
`;

export default UserLoggedInMutation;