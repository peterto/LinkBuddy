import { useState, useEffect, useCallback, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { useTheme, Divider } from "@rneui/themed";
import ListItem from "../components/ListItem";
import ListItemFooter from "../components/ListItemFooter";
import LinkdingApi from "../services/LinkdingApi";
import CustomSearchBar from "../components/CustomSearchBar";
import BookmarkCache from "../services/BookmarkCache";

const UnifiedLinksScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { path } = route.params;
  const swipeableRef = useRef(null);
  let tags;
  if (route.params.tags) {
    tags = route.params.tags;
    // navigation.setOptions({ title: `#${tags.name}` });
  }

  const isDarkMode = useColorScheme() === "dark";
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [activeSwipeable, setActiveSwipeable] = useState(null);

  const limit = 100;

  useEffect(() => {
    const delaySearch = setTimeout(
      () => {
        setOffset(0);
        setLinks([]);
        fetchLinks();
      },
      searchQuery ? 100 : 0
    );

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setLinks([]);
    fetchLinks().then(() => setRefreshing(false));
  }, [searchQuery]);

  const handleRemoveItem = (itemId) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== itemId));
    setTotalBookmarks((prev) => prev - 1); // Update total count
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      let data;

      // Check cache first for specific views
      if (offset === 0 && !searchQuery) {
        switch (path) {
          case "unread":
            data = BookmarkCache.getCached("unread");
            break;
          case "untagged":
            data = BookmarkCache.getCached("untagged");
            break;
          case "shared":
            data = BookmarkCache.getCached("shared");
            break;
        }
      }

      // If no cache or pagination/search, fetch normally
      if (!data) {
        let searchParam = searchQuery;

        // For bytag, combine tag name with search query if it exists
        if (path === "bytag") {
          searchParam = searchQuery
            ? `${route.params.tags.name} ${searchQuery}`
            : route.params.tags.name;
        }

        let response;
        switch (path) {
          case "archive":
            response = await LinkdingApi.getArchivedBookmarks({
              limit,
              offset,
              q: searchParam,
            });
            break;
          case "bytag":
            response = await LinkdingApi.getBookmarks({
              limit,
              offset,
              query: `#${searchParam}`,
            });
            break;
          case "unread":
            response = await LinkdingApi.getUnreadBookmarks({
              limit,
              offset,
              query: searchParam ? `${searchParam}` : "",
            });
            break;
          case "untagged":
            response = await LinkdingApi.getUntaggedBookmarks({
              limit,
              offset,
              q: searchParam,
            });
            break;
          case "shared":
            response = await LinkdingApi.getSharedBookmarks({
              limit,
              offset,
              query: searchParam ? `${searchParam}` : "",
            });
            break;
          default:
            response = await LinkdingApi.getBookmarks({
              limit,
              offset,
              query: searchParam,
            });
        }

        data = await response.json();
      }

      if (data && data.results) {
        setLinks((prevLinks) =>
          offset === 0 ? data.results : [...prevLinks, ...data.results]
        );
        setTotalBookmarks(data.count);
        setHasMore(data.results.length === limit);
      } else {
        setLinks([]);
        setTotalBookmarks(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
      fetchLinks();
    }
  };

  const getItemLayout = (data, index) => ({
    length: 100 + 1, // Add 1 for the divider height
    offset: (100 + 1) * index,
    index,
  });

  const closeSwipeable = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const handleScroll = () => {
    closeSwipeable();
  };

  const handleTouchStart = () => {
    closeSwipeable();
  };

  const handleListScroll = () => {
    if (activeSwipeable) {
      activeSwipeable.close();
      setActiveSwipeable(null);
    }
  };

  const handleListTouchStart = () => {
    if (activeSwipeable) {
      activeSwipeable.close();
      setActiveSwipeable(null);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <ListItem
        item={item}
        navigation={navigation}
        onRemoveItem={handleRemoveItem}
        isArchiveScreen={path === "archive"}
        onScroll={handleListScroll}
        onTouchStart={handleListTouchStart}
      />
    ),
    [navigation, path, handleRemoveItem, handleListScroll, handleListTouchStart]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        color={theme.colors.background}
      />

      {/* <AddLinkButton navigation={navigation} /> */}

      {/* In header */}
      {/* <CustomSearchBar
        searchQuery={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          setOffset(0);
          setLinks([]);
        }}
      /> */}

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <CustomSearchBar
            searchQuery={searchQuery}
            onChangeText={(query) => {
              setSearchQuery(query);
              setOffset(0);
              setLinks([]);
            }}
          />
        }
        data={links}
        renderItem={renderItem}
        keyExtractor={(item) => `link-${item.id}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListItemFooter
            totalBookmarks={totalBookmarks}
            loading={loading}
            hasMore={hasMore}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.text]}
          />
        }
        contentContainerStyle={[styles.container, theme.colors.background]}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        removeClippedSubviews={true}
        ItemSeparatorComponent={
          <Divider
            style={[styles.listDivider, { color: theme.colors.primary }]}
          />
        }
        // onScroll={handleScroll}
        // onTouchStart={handleTouchStart}
        // Add these additional optimizations:
        // maintainVisibleContentPosition={{
        //   minIndexForVisible: 0,
        //   autoscrollToTopThreshold: 10,
        // }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 10,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#eee",
  },
  listDivider: {
    width: "100%",
    alignSelf: "center",
  },
  androidHeader: {
    elevation: 4,
    paddingTop: StatusBar.currentHeight,
    height: 56 + StatusBar.currentHeight,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  androidHeaderTitle: {
    // color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UnifiedLinksScreen;
