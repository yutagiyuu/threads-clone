import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Stack } from "expo-router";
import ProfileSearch from "@/components/ProfileSearc";
import { Doc } from "@/convex/_generated/dataModel";
import { Colors } from "@/constants/Colors";

export default function Page() {
  const [search, setSearch] = useState("");
  const userList = useQuery(api.users.searchUsers, { search });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Search",
          headerSearchBarOptions: {
            placeholder: "Search",
            onChangeText: (event) => setSearch(event.nativeEvent.text),
            tintColor: "black",
            autoFocus: true,
            hideWhenScrolling: false,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
      <FlatList
        data={userList}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No users found</Text>
        )}
        renderItem={({ item }) => <ProfileSearch user={item as Doc<"users">} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  user: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
