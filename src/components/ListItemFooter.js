import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@rneui/themed";

const renderFooter = ({ totalBookmarks, loading, hasMore, theme: theme }) => {
  if (loading) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.totalCount, { color: theme.colors.text }]}>
          {totalBookmarks} {totalBookmarks === 1 ? "Bookmark" : "Bookmarks"}
        </Text>
      </View>
    );
  }

  return null;
};

const ListItemFooter = ({ totalBookmarks, loading, hasMore }) => {
  const { theme } = useTheme();

  return renderFooter({ totalBookmarks, loading, hasMore, theme });
};

const styles = StyleSheet.create({
  totalCount: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 5,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default ListItemFooter;
