import React, { useRef, memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useSharedValue,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { useTheme, Card } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LinkdingApi from "../services/LinkdingApi";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const SCREEN_WIDTH = Dimensions.get("window").width;

let activeSwipeable = null;

const getDomainFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const _handlePressButtonAsync = async (url) => {
  WebBrowser.openBrowserAsync(url);
};

const ListItem = ({
  item,
  navigation,
  onRemoveItem,
  isArchiveScreen,
  onScroll,
  onTouchStart,
}) => {
  const { theme } = useTheme();
  const swipeableRef = useRef(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fadeOut = () => {
    "worklet";
    opacity.value = withTiming(0, { duration: 10 });
  };

  const handlePress = () => {
    if (activeSwipeable && activeSwipeable !== swipeableRef.current) {
      activeSwipeable.close();
    }
    activeSwipeable = swipeableRef.current;
  };

  const handleSwipeableOpen = () => {
    if (activeSwipeable && activeSwipeable !== swipeableRef.current) {
      activeSwipeable.close();
    }
    activeSwipeable = swipeableRef.current;
  };

  const closeSwipeable = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const handleUrlPress = () => {
    if (!isSwipeActive && !swipeableRef.current?.isOpen) {
      _handlePressButtonAsync(item.url);
    }
  };

  const handleArchive = () => {
    // fadeOut();
    setTimeout(async () => {
      try {
        await LinkdingApi.archiveBookmark(item.id);
        runOnJS(onRemoveItem)(item.id);
      } catch (error) {
        console.log("Archive error:", error);
      }
    }, 10);
  };

  const handleUnarchive = async () => {
    try {
      await LinkdingApi.unarchiveBookmark(item.id);
      onRemoveItem(item.id);
      // runOnJS(onRemoveItem)(item.id);
    } catch (error) {
      console.log("Unarchive error:", error);
    }
  };

  const handleEdit = async () => {
    try {
      closeSwipeable();
      navigation.navigate("BookmarkScreen", { bookmark: item.id });
    } catch (error) {
      console.log("Edit error:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bookmark",
      "Are you sure you want to delete this bookmark?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            fadeOut();
            setTimeout(async () => {
              try {
                await LinkdingApi.deleteBookmark(item.id);
                runOnJS(onRemoveItem)(item.id);
              } catch (error) {
                console.log("Delete error:", error);
              }
            }, 10);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = () => {
    // console.log("Item is:", item.is_archived);

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.edit }]}
          // onPress={() =>
          //   navigation.navigate("BookmarkScreen", { bookmark: item.id })
          // }
          onPress={handleEdit}
        >
          <Feather name="edit" size={24} color={theme.colors.text} />
          {/* <Text
            style={[
              styles.actionText,
              { color: theme.colors.text, backgroundColor: theme.colors.edit },
            ]}
          >
            Edit
          </Text> */}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={handleArchive}
        >
          <Text style={[styles.actionText, {color: theme.colors.text}]}>Archive</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.archive },
          ]}
          // onPress={item.is_archived ? handleUnarchive : handleArchive}
          onPress={isArchiveScreen ? handleUnarchive : handleArchive}
        >
          <MaterialIcons name={isArchiveScreen ? "unarchive" : "archive"} size={24} color={theme.colors.text} />
          {/* <Text
            style={[
              styles.actionText,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.archive,
                fontSize: isArchiveScreen ? 13 : 17,
              },
            ]}
          > */}
            {/* {item.is_archived ? "Unarchive" : "Archive"} */}
            {/* {isArchiveScreen ? "Unarchive" : "Archive"} */}
          {/* </Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.delete },
          ]}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={30} color={theme.colors.text} />
          {/* <Text
            style={[
              styles.actionText,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.delete,
              },
            ]}
          >
            Delete
          </Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={styles.leftActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swipeableRef}
        simultaneousHandlers={[]}
        renderRightActions={renderRightActions}
        overshootLeft={false}
        overshootRight={false}
        friction={0.2}
        dampingRatio={0.4}
        onSwipeableOpen={handleSwipeableOpen}
        onTouchStart={handleSwipeableOpen}
        onSwipeableWillOpen={() => setIsSwipeActive(true)}
        onSwipeableWillClose={() => setIsSwipeActive(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          delayPressIn={200}
          hitSlop={{ left: 0, right: 0 }}
          pressRetentionOffset={{ left: 5, right: 5 }}
        >
          <Animated.View style={animatedStyle}>
            <Card
              containerStyle={[
                styles.card,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <View style={styles.cardContent}>
                {item.preview_image_url ? (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.2 : 1,
                        backgroundColor: theme.colors.background,
                      },
                    ]}
                    onPress={() =>
                      _handlePressButtonAsync(item.preview_image_url)
                    }
                    // delayPressIn={200}
                  >
                    <Card.Image
                      source={{ uri: item.preview_image_url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : (
                  <View
                    style={[
                      styles.image,
                      {
                        backgroundColor: theme.colors.background,
                      },
                    ]}
                  />
                )}
                <Pressable
                  // style={({ pressed }) => pressed ? { color: theme.colors.border } : { color: theme.colors.text }}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.2 : 1,
                      backgroundColor: theme.colors.background,
                    },
                    // styles.button,
                  ]}
                  // onPress={() => _handlePressButtonAsync(item.url)}
                  onPress={handleUrlPress}
                  // delayPressIn={200}
                  // disabled={isSwipeActive}
                  // activeOpacity={0.7}
                >
                  <View style={styles.textContent}>
                    <Text
                      style={[styles.title, { color: theme.colors.text }]}
                      // style={[styles.title, ({ pressed }) => pressed ? { color: theme.colors.warning } : { color: theme.colors.warning }]}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                    <View style={styles.metadataRow}>
                      <Text
                        style={[styles.domain, { color: theme.colors.text }]}
                      >
                        {getDomainFromUrl(item.url)}
                      </Text>
                      <Text style={[styles.date, { color: theme.colors.text }]}>
                        {/* {moment(item.date_added).format("MMMM D, YYYY")} */}
                        {moment(item.date_added).format("YYYY-MM-DD")}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </Card>
          </Animated.View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    paddingLeft: 1,
    margin: 0,
    borderWidth: 0,
    // marginBottom: 10,
    // elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  textContent: {
    flex: 1,
    paddingLeft: 10,
    // padding: 0,
    paddingRight: 10,
    width: SCREEN_WIDTH - 120,
    position: "relative",
    minHeight: 80,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 5,
    paddingTop: 5,
    // height: 55,
    // lineHeight: 21,
  },
  image: {
    height: 80,
    width: 80,
    marginLeft: 10,
    borderRadius: 4,
  },
  url: {
    marginBottom: 5,
  },
  metadataRow: {
    // position: "absolute",
    // bottom: 8,
    // left: 10,
    // right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "5%",
    // borderColor: "brown",
    // borderWidth: 1,
  },
  domain: {
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  date: {
    fontSize: 12,
    textAlign: "right",
  },
  rightActions: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.5,
    height: "100%",
  },
  leftActions: {
    // padding: 10,
    paddingLeft: 5,
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.25,
    height: "100%",
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.25,
  },
  actionText: {
    // color: "white",
    fontWeight: "600",
    padding: 5,
    fontSize: 17,
  },
});

export default memo(ListItem);
