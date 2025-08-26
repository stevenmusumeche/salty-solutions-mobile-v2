import { router, Tabs } from "expo-router";
import React from "react";

import { brandYellow, gray, white } from "@/constants/colors";
import { useLocationContext } from "@/context/LocationContext";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  const { activeLocation } = useLocationContext();
  if (!activeLocation) return null;

  return (
    <Tabs
      screenOptions={{
        headerTintColor: white,
        headerStyle: { backgroundColor: gray[800] },
        tabBarActiveTintColor: brandYellow,
        tabBarInactiveTintColor: gray["200"],
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
            <Entypo name="gauge" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: "Forecast for " + activeLocation.name,
          tabBarLabel: "Forecast",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tides"
        options={{
          title: "Tides for " + activeLocation.name,
          tabBarLabel: "Tides",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="sine-wave"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="satellite"
        options={{
          title: "Satellite for " + activeLocation.name,
          tabBarLabel: "Satellite",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="satellite-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="salinity"
        options={{
          title: "Salinity Map for " + activeLocation.name,
          tabBarLabel: "Salinity",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="water" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About Salty Solutions",
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
