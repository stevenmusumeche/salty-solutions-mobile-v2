import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    dataIdFromObject: () => false, // Disable normalization
  }),
});
