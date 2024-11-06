import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import Thread from "@/components/Thread";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Colors } from "@/constants/Colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Comments from "@/components/Comment";

export default function ThreadDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<"messages">,
  });
  const { userProfile } = useUserProfile();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{ flexGrow: 1, marginBottom: 0 }}>
      <ScrollView>
        {thread ? <Thread thread={thread as any} /> : <ActivityIndicator />}
        <Comments threadId={id as Id<"messages">} />
      </ScrollView>
      <View style={styles.border} />
      <Link href={`/(modal)/reply/${id}`} asChild>
        <TouchableOpacity style={styles.replyButton}>
          <Image
            source={{ uri: userProfile?.imageUrl as string }}
            style={styles.replyButtonImage}
          />
          <Text>Reply to {thread?.creator?.first_name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    margin: 6,
    backgroundColor: Colors.itemBackground,
    borderRadius: 100,
    gap: 10,
  },
  replyButtonImage: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
});
