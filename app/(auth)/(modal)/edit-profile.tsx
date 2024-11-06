import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { biostring, linkstring, userId, imageUrl, pushToken } =
    useLocalSearchParams<{
      biostring: string;
      linkstring: string;
      userId: string;
      imageUrl: string;
      pushToken: string;
    }>();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const onDone = async () => {
    await updateUser({
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
      pushToken,
    });
    if (selectedImage) {
      await updateProfilePicture();
    }

    router.dismiss();
  };

  const updateProfilePicture = async () => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(selectedImage!.uri);
    const blob = await response.blob();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.mimeType! },
      body: blob,
    });
    const { storageId } = await result.json();
    console.log("🚀 ~ updateProfilePicture ~ storageId:", storageId);
    // Step 3: Save the newly allocated storage id to the database
    await updateImage({ storageId, _id: userId as Id<"users"> });
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableOpacity onPress={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={styles.bioInput}
          textAlignVertical="top"
          placeholder="Tell About yourself"
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          autoCapitalize="none"
          placeholder="https://www.example.com"
        />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  bioInput: {
    height: 100,
  },
  section: {
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    margin: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
