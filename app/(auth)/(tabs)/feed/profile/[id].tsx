import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import Profile from "@/components/Profile";

const CreatorProfile = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as Id<"users">} showBackbutton />;
};

export default CreatorProfile;

const styles = StyleSheet.create({});
