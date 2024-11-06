import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Thread",
          headerShadowVisible: false,
          headerRight: () => (
            <Ionicons name="notifications-outline" size={24} color="black" />
          ),
          headerTintColor: "black",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
