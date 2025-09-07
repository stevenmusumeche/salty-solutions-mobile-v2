import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { gray, white } from "@/constants/colors";
import { LocationContextProvider } from "@/context/LocationContext";
import { PurchaseContextProvider } from "@/context/PurchaseContext";
import { TideContextProvider } from "@/context/TideContext";
import CloseButton from "./ui/CloseButton";

const modalScreenOptions = {
  presentation: "modal" as const,
  headerTintColor: white,
  headerStyle: {
    backgroundColor: gray[800],
  },
  headerRight: CloseButton,
};

export default function AuthenticatedApp() {
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
                  ...modalScreenOptions,
                  title: "Change Location",
                }}
              />
              <Stack.Screen
                name="full-screen-chart"
                options={modalScreenOptions}
              />
              <Stack.Screen
                name="salinity-detail"
                options={modalScreenOptions}
              />
              <Stack.Screen
                name="satellite-detail"
                options={modalScreenOptions}
              />
              <Stack.Screen
                name="modis-info"
                options={{
                  ...modalScreenOptions,
                  title: "About MODIS Satellite Imagery",
                }}
              />
              <Stack.Screen
                name="solunar-teaser"
                options={{
                  ...modalScreenOptions,
                  title: "Solunar Fishing Intelligence",
                }}
              />
              <Stack.Screen
                name="tide-station-modal"
                options={{
                  ...modalScreenOptions,
                  title: "Change Tide Stations",
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
