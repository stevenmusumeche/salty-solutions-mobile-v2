import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Location: {
        fields: {
          temperature: {
            merge: false,
          },
          wind: {
            merge: false,
          },
        },
      },
      UsgsSite: {
        fields: {
          salinity: {
            merge: false,
          },
          waterTemperature: {
            merge: false,
          },
          wind: {
            merge: false,
          },
        },
      },
      TidePreditionStation: {
        fields: {
          temperature: {
            merge: false,
          },
          waterTemperature: {
            merge: false,
          },
          wind: {
            merge: false,
          },
        },
      },
    },
  }),
});
