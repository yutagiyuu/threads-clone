import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";

type UserProfileProps = {
  userId?: string;
};
const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });
  const { userProfile } = useUserProfile();
  const isSelf = userId === userProfile?._id;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>
        <Image source={{ uri: profile?.imageUrl! }} style={styles.image} />
      </View>
      <Text style={styles.bio}>{profile?.bio || "No Bio"}</Text>
      <Text>
        {profile?.followersCount} · {profile?.websiteUrl || "No website"}
      </Text>
      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={`/(modal)/edit-profile?biostring=${
                profile?.bio ? encodeURIComponent(profile?.bio) : ""
              }&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : ""}&userId=${
                profile?._id
              }&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ""}&pushToken=${profile?.pushToken ? encodeURIComponent(profile?.pushToken) : ""}`}
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  bio: {
    marginVertical: 16,
    fontSize: 14,
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  fullButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "black",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  fullButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  buttonRow: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  profileTextContainer: {
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "gray",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
