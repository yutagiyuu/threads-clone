import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import UserProfile from "./UserProfile";
import Tabs from "./Tabs";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "./Thread";

type ProfileProps = {
  userId?: Id<"users">;
  showBackbutton?: boolean;
};

const Profile = ({ showBackbutton = false, userId }: ProfileProps) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.messages.getThreads,
    {
      userId: userId || userProfile?._id,
    },
    {
      initialNumItems: 5,
    }
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Link href={`/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
              />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven't posted anything yet.
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackbutton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={router.back}
                >
                  <Ionicons name="chevron-back" />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name="logo-instagram" size={24} color={"black"} />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name="log-out-outline" size={24} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>

            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile && <UserProfile userId={userProfile._id} />}
            <Tabs onTabChange={() => {}} />
          </>
        }
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabContentText: {
    fontSize: 17,
    color: Colors.border,
    textAlign: "center",
    marginVertical: 16,
  },
});
