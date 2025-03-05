import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import LinkdingApi from "../services/LinkdingApi";

import { useTheme, Divider } from "@rneui/themed";
import { useRoute } from "@react-navigation/native";

const TagScreen = ({ navigation }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  const isDarkMode = useColorScheme() === "dark";
  const route = useRoute();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      // Clear the parameter
      navigation.setParams({ refresh: undefined });
      
      // Refresh your data
      fetchTags();
    }
  }, [route.params?.refresh]);

  const fetchTags = async () => {
    try {
      const data = await LinkdingApi.getTags();
      const sortedTags = data.results.sort(
        (a, b) => b.bookmark_count - a.bookmark_count
      );
      setTags(sortedTags);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setLoading(false);
    }
  };

  const renderTagItem = ({ item }) => (
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
  );

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Loading tags...
        </Text>
      </View>
    );
  }

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
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => (
            <Divider
              style={[styles.listDivider, { color: theme.colors.primary }]}
            />
          )}
          // scrollEventThrottle={16}
          // onScroll={navigation.setOptions}
          // scrollIndicatorInsets={{ top: 0 }}
          // ListHeaderComponent={<View style={{ height: 16 }} />}
          // ListFooterComponent={<View style={{ height: 16 }} />}
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
    marginBottom: 8,
    borderRadius: 8,
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
});

export default TagScreen;
