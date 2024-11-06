import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  InputAccessoryView,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { router, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};
const ThreadComposer = ({
  isPreview,
  isReply,
  threadId,
}: ThreadComposerProps) => {
  const [threadContent, setThreadContent] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState<string>();
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );

  const inputAccessoryViewID = "uniqueID";

  const { userProfile } = useUserProfile();

  const addThread = useMutation(api.messages.addThreadMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const mediaStorageIds = await Promise.all(
      mediaFiles.map((file) => uploadMediaFile(file))
    );
    addThread({
      threadId,
      content: threadContent,
      mediaFiles: mediaStorageIds,
    });
    setThreadContent("");
    setMediaFiles([]);
    router.dismiss();
  };

  const removeThread = () => {
    setThreadContent("");
    setMediaFiles([]);
  };

  const handleCancel = async () => {
    setThreadContent("");
    Alert.alert("Discard thread ?", "", [
      {
        text: "Discard",
        style: "destructive",
        onPress: () => router.dismiss(),
      },
      {
        text: "Save Draft",
        style: "cancel",
        // onPress: () => router.dismiss(),
      },
      {
        text: "Cancel",
        style: "cancel",
        // onPress: () => router.dismiss(),
      },
    ]);
  };

  const uploadMediaFile = async (image: ImagePicker.ImagePickerAsset) => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(image!.uri);
    const blob = await response.blob();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": image!.mimeType! },
      body: blob,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  const selectImage = async (source: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    };

    let result;

    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => (isPreview ? router.push("/(auth)/(modal)/create") : null)}
      style={
        isPreview
          ? {
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              height: 100,
              pointerEvents: "box-only",
              flex: 1,
            }
          : {
              flex: 1,
            }
      }
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.topRow}>
        <Image source={{ uri: userProfile?.imageUrl! }} style={styles.avatar} />
        <View style={styles.centerContainter}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isReply ? "Reply to thread" : "What's new?"}
            value={threadContent}
            onChangeText={setThreadContent}
            multiline
            autoFocus={!isPreview}
          />
          {mediaFiles.length > 0 && (
            <ScrollView horizontal>
              {mediaFiles.map((file, index) => (
                <View key={index} style={styles.mediaContainer}>
                  <Image source={{ uri: file.uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={removeThread}
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
        >
          <Ionicons name="close" size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={[styles.keyboardAccessory]}>
            <Text style={styles.keyboardAccessoryText}>
              {isReply
                ? "Everyone can reply and quote"
                : " Profiles that you follow can reply and quote"}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}

      {Platform.OS === "android" && !isPreview && (
        <View style={styles.androidAccessoryView}>
          <View style={[styles.keyboardAccessory]}>
            <Text style={styles.keyboardAccessoryText}>
              {isReply
                ? "Everyone can reply and quote"
                : " Profiles that you follow can reply and quote"}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ThreadComposer;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerContainter: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center"
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  keyboardAccessory: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mediaContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
  },
  mediaImage: {
    width: 100,
    height: 200,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 10,
  },
  androidAccessoryView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 8,
    alignItems: "center",
  },
});
