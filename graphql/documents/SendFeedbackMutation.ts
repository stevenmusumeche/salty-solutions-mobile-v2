import { gql } from '@apollo/client';

export const SEND_FEEDBACK_MUTATION = gql`
  mutation SendFeedback($input: SendFeedbackInput!) {
    sendFeedback(input: $input) {
      success
    }
  }
`;