import { Stack, Tabs } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Search" }} />
    </Stack>
  );
}
