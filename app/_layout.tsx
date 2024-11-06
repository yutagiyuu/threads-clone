import { tokenCache } from "@/utils/cache";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import * as Sentry from "@sentry/react-native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  Slot,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import * as splashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox } from "react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1.0,
  _experiments: {
    profileSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [Sentry.mobileReplayIntegration(), navigationIntegration],
});

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

splashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const { isLoaded, isSignedIn } = useAuth();
  const segement = useSegments();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (fontLoaded) {
      splashScreen.hideAsync();
    }
  }, [fontLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segement[0] === "(auth)";
    if (isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/feed");
    } else if (!isSignedIn && inAuthGroup) {
      router.replace("/(public)");
    }

    if (fontLoaded) {
      splashScreen.hideAsync();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({
        email: user.user.emailAddresses[0].emailAddress,
        id: user.user.id,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  return <Slot />;
};

function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref);
  }, [ref]);
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);
