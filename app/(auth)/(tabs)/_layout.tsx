import { Colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

const CreateTabIcon = ({
  color,
  focused,
  size,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.itemBackground,
        padding: 6,
        borderRadius: 8,
      }}
    >
      <Ionicons name="add" color={color} size={size} />
    </View>
  );
};

export default function Layout() {
  const { signOut } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <CreateTabIcon color={color} focused={focused} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.selectionAsync();
            router.push("/(modal)/create");
          },
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
