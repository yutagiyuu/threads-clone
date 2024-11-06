import { usePush } from "@/hooks/usePush";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Layout = () => {
  usePush();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/create"
        options={{
          title: "New Thread",
          presentation: "modal",
          //   headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal-circle" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/edit-profile"
        options={{
          title: "Edit Profile",
          headerTitleAlign: "center",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal-circle" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/image/[url]"
        options={{
          title: "",
          presentation: "fullScreenModal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color={"white"} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "black",
          },
        }}
      />
      <Stack.Screen
        name="(modal)/reply/[id]"
        options={{
          presentation: "modal",
          title: "Reply",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
