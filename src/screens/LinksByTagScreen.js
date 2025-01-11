import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { Searchbar } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import ListItem from "../components/ListItem";
import ListItemFooter from "../components/ListItemFooter";
import LinkdingApi from "../services/LinkdingApi";

// const AllLinksScreen = ({ navigation }) => {
const LinksByTagScreen = ({ navigation, route }) => {
  //   const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = true;

  const darkModeStatusBarColor = "#121212";
  const statusBarColor = "#f5f5f5";
  //   const statusBarColor = "#000";
  const darkModeCardColor = "#1a1a1a";
  const cardColor = "#ffffff";
  //   const darkModeUrlTitleTextColor = "#4dabf5";
  //   const urlTitleTextColor = "#ffffff";
  const darkModeUrlTitleTextColor = "#4dabf5";
  const urlTitleTextColor = "#4dabf5";

  const fontColor = "#000000";
  const darkModeFontColor = "#ffffff";
  const darkModePlaceHolderTextColor = "#999";
  const placeHolderTextColor = "#666";

  const containerBackgroundColor = "#121212";
  const darkModeContainerBackgroundColor = "#ffffff";

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    setLinks([]);
    fetchLinks().then(() => setRefreshing(false));
  }, []);

  // console.log("Tags:", route.params.tags.name);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      // const searchParam = searchQuery
      //   ? `&q=${encodeURIComponent(searchQuery)}`
      //   : "";

      const searchParam = route.params.tags.name ? route.params.tags.name : "";

      // console.log(searchParam);
      // const response = await fetch(
      //   `${baseURL}/api/bookmarks/?limit=${limit}&offset=${offset}${searchParam}`,
      //   {
      //     headers: {
      //       Authorization: `${jwtToken}`,
      //     },
      //   }
      // );

      const response = await LinkdingApi.getBookmarksByTag({
        limit: limit,
        offset: offset,
        q: searchParam,
      });

      // const data = await response.json();
      const data = await response;
      setLinks((prevLinks) =>
        offset === 0 ? data.results : [...prevLinks, ...data.results]
      );
      setTotalBookmarks(data.count); // Add this line to store total count
      setHasMore(data.results.length === limit);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching links:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setOffset(0);
      setLinks([]);
      fetchLinks();
    }, 100);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
      fetchLinks();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <StatusBar
        backgroundColor={isDarkMode ? darkModeStatusBarColor : statusBarColor}
        // backgroundColor={"isDarkMode ? darkModeStatusBarColor : statusBarColor"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <Searchbar
        placeholder="Search links..."
        onChangeText={(query) => {
          setSearchQuery(query);
          setOffset(0);
          setLinks([]);
        }}
        onSubmitEditing={() => fetchLinks()}
        value={searchQuery}
        style={{
          margin: 10,
          backgroundColor: isDarkMode ? "#333" : "#fff",
        }}
        inputStyle={{
          color: isDarkMode ? darkModeFontColor : fontColor,
        }}
        iconColor={isDarkMode ? darkModeFontColor : fontColor}
        placeholderTextColor={
          isDarkMode ? darkModePlaceHolderTextColor : placeHolderTextColor
        }
        // mode='outlined'
      />
      <FlatList
        data={links}
        // renderItem={renderItemView}
        renderItem={({ item }) => (
          <ListItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={renderFooter}
        // ListFooterComponent={({ item }) => (<ListItemFooter totalBookmarks={totalBookmarks} loading={loading} hasMore={hasMore} />)}
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
            // colors={["#4dabf5"]} // Android
            // colors={isDarkMode ? darkModeUrlTitleTextColor : urlTitleTextColor} // Android
            colors={[
              isDarkMode ? darkModeUrlTitleTextColor : urlTitleTextColor,
            ]} // Android
            // tintColor={isDarkMode ? "#ffffff" : "#000000"} // iOS
            tintColor={isDarkMode ? darkModeFontColor : fontColor} // iOS
          />
        }
        contentContainerStyle={[
          styles.container,
          isDarkMode && darkModeContainerBackgroundColor,
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkSafeArea: {
    backgroundColor: "#121212",
  },
  container: {
    padding: 10,
    flexGrow: 1,
  },
  containerColor: {
    backgroundColor: "#121212",
  },
  darkModeContainerColor: {
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default LinksByTagScreen;
