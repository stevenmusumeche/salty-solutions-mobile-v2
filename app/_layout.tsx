import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { gray, red, white } from "@/constants/colors";
import { LocationContextProvider } from "@/context/LocationContext";
import { UserContextProvider, useUserContext } from "@/context/UserContext";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoginScreen from "./login";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={white} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

function AuthenticatedApp() {
  return (
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
          <Stack.Screen
            name="salinity-detail"
            options={{
              presentation: "modal",
              headerTintColor: white,
              headerStyle: {
                backgroundColor: gray[800],
              },
            }}
          />
          <Stack.Screen
            name="satellite-detail"
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
  );
}

function AppContent() {
  const { user } = useUserContext();

  if (user.loading) {
    return <LoadingScreen />;
  }

  if ("error" in user && user.error) {
    return <ErrorScreen error={user.error} />;
  }

  if (!user.isLoggedIn) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp />;
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
        <AppContent />
      </UserContextProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: gray[700],
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: white,
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: red["700"],
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
