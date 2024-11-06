import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ThreadComposer from "../create";
import Thread from "@/components/Thread";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useQuery(api.messages.getThreadById, {
    messageId: id as Id<"messages">,
  });
  return (
    <View style={{ flex: 1 }}>
      {thread ? (
        <Thread
          thread={thread as Doc<"messages"> & { creator: Doc<"users"> }}
        />
      ) : (
        <ActivityIndicator />
      )}

      <ThreadComposer isReply={true} threadId={id as Id<"messages">} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
