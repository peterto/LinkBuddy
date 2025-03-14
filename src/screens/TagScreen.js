import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Pressable,
  RefreshControl,
} from "react-native";
import LinkdingApi from "../services/LinkdingApi";

import { useTheme, Divider, Icon } from "@rneui/themed";
import { useRoute } from "@react-navigation/native";

const TagScreen = ({ navigation }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalTags, setTotalTags] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  const limit = 20;

  const { theme } = useTheme();

  const isDarkMode = useColorScheme() === "dark";
  const route = useRoute();

  // useEffect(() => {
  //   fetchTags();
  // }, []);

  useEffect(() => {
    // Initial fetch
    setInitialLoading(true);
    setOffset(0);
    setTags([]);
    fetchTags().finally(() => {
      setInitialLoading(false);
    });
  }, []);

useEffect(() => {
  if (offset > 0) {
    fetchTags();
  }
}, [offset]);


  useEffect(() => {
    if (route.params?.refresh) {
      navigation.setParams({ refresh: undefined });
      // setTags([]);
      // setOffset(0);
      // fetchTags();

      // Reset everything completely
    setTags([]);
    setOffset(0);
    setHasMore(true);
    setInitialLoading(true);
    
    // Fetch tags from the beginning
    fetchTags(true).finally(() => {
      setInitialLoading(false);
    });
    }
  }, [route.params?.refresh]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setInitialLoading(true);
    // setOffset(0);
    // setTags([]);
    fetchTags(true)
      .then(() => setRefreshing(false))
      .then(() => setInitialLoading(false));
  }, [tags]);


  const fetchTags = async (refresh = false) => {
    try {
      setLoading(true);
      
      // Use local offset variable to ensure we're fetching from the beginning on refresh
      const fetchOffset = refresh ? 0 : offset;
      
      const response = await LinkdingApi.getTagsWithParams({
        limit,
        offset: fetchOffset,
      });
  
      const data = await response.json();
  
      if (data && data.results) {
        // When refreshing or at offset 0, replace tags completely
        setTags((prevTags) => {
          if (refresh || fetchOffset === 0) {
            return data.results;
          } else {
            return [...prevTags, ...data.results];
          }
        });
        
        setHasMore(data.results.length === limit);
      } else {
        if (refresh || fetchOffset === 0) {
          setTags([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset(prevOffset => prevOffset + limit);
    }
  };
  

  const renderTagItem = useCallback(({ item }) => (
    <>
      <TouchableOpacity
        // onPress={() => navigation.navigate("LinksByTagScreen", { tags: item })}
        onPress={() =>
          navigation.navigate("LinksByTagScreen", {
            path: "bytag",
            tags: item,
            title: `#${item.name}`,
          })
        }
        color={theme.colors.background}
        radius={0}
        // style={styles.tagItem}
      >
        <View
          style={[styles.tagItem, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.tagName, { color: theme.colors.buttonText }]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
      {/* <Divider width={1} color={theme.colors.primary} /> */}
    </>
  ), [offset]);

  const renderHeader = () => {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />
        <View
          style={[styles.container, { backgroundColor: theme.colors.primary }]}
        ></View>
      </SafeAreaView>
    );
  };

  const renderEmpty = () => {
    if (!loading) {
      return (
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Icon
            name="tag-outline"
            type="material-community"
            size={60}
            color={theme.colors.buttonText}
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.buttonText }]}>
            No Tags Found
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: theme.colors.buttonText }]}
          >
            Tags help you organize your bookmarks
          </Text>
          <Pressable
            onPress={() => navigation.navigate("AddTagScreen")}
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.2 : 1, margin: 2 },
              { padding: 2 },
              {
                backgroundColor: theme.colors.save,
              },
            ]}
            // delayLongPress={300}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name="plus"
              type="material-community"
              size={18}
              color={theme.colors.buttonText}
              style={styles.buttonIcon}
            />
            <Text
              style={[styles.buttonText, { color: theme.colors.buttonText }]}
            >
              Add Your First Tag
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={tags}
          renderItem={renderTagItem}
          // renderItem={({ item }) => (
          //   <ListItem item={item} navigation={navigation} />
          // )}
          // keyExtractor={(item) => item.id.toString()}
          keyExtractor={(item, index) => `tag-${item.id}-${index}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          // onMomentumScrollBegin={() => setIsEndReached(false)}
          // onMomentumScrollBegin={handleLoadMore}
          contentContainerStyle={styles.listContainer}
          windowSize={5}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={50}
          initialNumToRender={20}
          removeClippedSubviews={true}
          ItemSeparatorComponent={() => (
            <Divider
              style={[styles.listDivider, { color: theme.colors.primary }]}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.text]}
              tintColor={theme.colors.text}
            />
          }
          // scrollEventThrottle={16}
          // onScroll={navigation.setOptions}
          // scrollIndicatorInsets={{ top: 0 }}
          // ListHeaderComponent={<View style={{ height: 16 }} />}
          // ListFooterComponent={<View style={{ height: 16 }} />}
          // ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    borderRadius: 12,
    margin: 20,
    overflow: "hidden",
  },
  listContainer: {
    // borderRadius: 12,
    // paddingTop: 12,
    // paddingBottom: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tagItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 16,
    // marginBottom: 8,
    borderRadius: 12,
  },
  tagName: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
  countContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
  listDivider: {
    width: "90%",
    alignSelf: "center",
  },
  button: {
    borderRadius: 5,
    width: 250,
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    borderRadius: 12,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TagScreen;
