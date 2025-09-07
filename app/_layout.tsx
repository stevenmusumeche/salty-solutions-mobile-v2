import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { gray, red, white } from "@/constants/colors";
import { FontProvider } from "@/context/FontContext";
import { LocationContextProvider } from "@/context/LocationContext";
import { PurchaseContextProvider } from "@/context/PurchaseContext";
import { TideContextProvider } from "@/context/TideContext";
import { UserContextProvider, useUserContext } from "@/context/UserContext";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoginScreen from "./login";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

function CloseButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="close" size={24} color={white} />
    </TouchableOpacity>
  );
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
      <TideContextProvider>
        <PurchaseContextProvider>
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
                  headerRight: CloseButton,
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
              <Stack.Screen
                name="modis-info"
                options={{
                  presentation: "modal",
                  title: "About MODIS Satellite Imagery",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                }}
              />
              <Stack.Screen
                name="solunar-teaser"
                options={{
                  presentation: "modal",
                  title: "Solunar Fishing Intelligence",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                  headerRight: CloseButton,
                }}
              />
              <Stack.Screen
                name="tide-station-modal"
                options={{
                  presentation: "modal",
                  title: "Change Tide Stations",
                  headerTintColor: white,
                  headerStyle: {
                    backgroundColor: gray[800],
                  },
                  headerRight: CloseButton,
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </GestureHandlerRootView>
        </PurchaseContextProvider>
      </TideContextProvider>
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

  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <FontProvider>
          <AppContent />
        </FontProvider>
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
