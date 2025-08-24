import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { gray, white } from "@/constants/colors";
import { LocationContextProvider } from "@/context/LocationContext";
import { UserContextProvider } from "@/context/UserContext";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout() {
  const httpLink = createHttpLink({
    uri: "https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api",
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
      dataIdFromObject: () => false, // Disable normalization
    }),
  });

  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <LocationContextProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="location-switcher"
                options={{
                  presentation: "modal",
                  title: "Change Location",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                }}
              />
              <Stack.Screen
                name="about"
                options={{
                  presentation: "modal",
                  title: "About Salty Solutions",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                }}
              />
              <Stack.Screen
                name="full-screen-chart"
                options={{
                  presentation: "modal",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </GestureHandlerRootView>
        </LocationContextProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
}
