import Thread from "@/components/Thread";
import ThreadComposer from "@/components/ThreadComposer";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { usePaginatedQuery } from "convex/react";
import { Link, useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    }
  );

  const onLoadMore = () => {
    loadMore(5);
  };

  // Animation
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const updateTabBar = () => {
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }

    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabBar)();
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { marginBottom: 0 } });
      };
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <Animated.FlatList
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
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
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View style={{ paddingBottom: 16 }}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={{ width: 40, height: 40, alignSelf: "center" }}
          />
          <ThreadComposer isPreview />
        </View>
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{ paddingVertical: top }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({});
