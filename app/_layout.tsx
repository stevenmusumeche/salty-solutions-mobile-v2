import { LocationContextProvider } from "@/context/LocationContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gray, white } from "@/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const client = new ApolloClient({
    uri: "https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <LocationContextProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
          </Stack>
          <StatusBar style="light" />
        </GestureHandlerRootView>
      </LocationContextProvider>
    </ApolloProvider>
  );
}
