import { brandYellow, gray, white } from "@/colors";
import { useLocationContext } from "@/context/LocationContext";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Stack, Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureDetector, Pressable } from "react-native-gesture-handler";

export default function TabLayout() {
  const router = useRouter();
  const { activeLocation } = useLocationContext();
  if (!activeLocation) return null;

  return (
    <>
      <Tabs
        screenOptions={{
          headerTintColor: white,
          headerStyle: { backgroundColor: gray[800] },
          tabBarActiveTintColor: brandYellow,
          tabBarInactiveTintColor: white,
          tabBarStyle: { backgroundColor: gray[800] },
          headerRight: () => (
            <Ionicons
              name="location-outline"
              size={24}
              style={{ paddingInline: 10 }}
              color={brandYellow}
              onPress={() => router.push("/location-switcher")}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: activeLocation.name,
            tabBarLabel: "Now",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tides"
          options={{
            title: "Tides",
          }}
        />
        <Tabs.Screen
          name="forecast"
          options={{
            title: "Forecast",
          }}
        />
      </Tabs>
    </>
  );
}
