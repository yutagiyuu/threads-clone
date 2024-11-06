import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startGoogleFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const handleFacaebookLogin = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/login.png")}
        style={styles.loginImage}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>How would you like to use threads?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleFacaebookLogin}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={require("@/assets/images/instagram_icon.webp")}
                style={styles.loginButtonIcon}
              />
              <Text style={styles.loginButtonText}>
                Continue with Instagram
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              Log in or create a Threads profile with your Instagram account.
              With a profile, you can post, interact and get personalised
              recommendation.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoogleLogin}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Use without a profile</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse threads without a profile, but won't be able to
              post, interact or get personalised recommendations.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.switchAccountButtontext}>Switch accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    backgroundColor: Colors.background,
  },
  loginImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  title: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
  },
  loginButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  buttonContainer: {
    gap: 20,
    marginHorizontal: 20,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonIcon: {
    width: 50,
    height: 50,
  },
  loginButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    flex: 1,
  },
  loginButtonSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    marginTop: 5,
    color: "#acacac",
  },
  switchAccountButtontext: {
    fontSize: 14,
    color: Colors.border,
    alignSelf: "center",
  },
});
