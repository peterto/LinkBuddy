import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { Divider } from "@rneui/base";

const HomeScreenList = ({ navigation }) => {
  const { theme } = useTheme();
  const isDarkMode = useColorScheme() === "dark";

  const quickActionMenuItems = [
    {
      id: "1",
      title: "Your Links",
      icon: "link",
      route: "Links",
    },
    {
      id: "2",
      title: "Archive",
      icon: "archive",
      route: "Links",
      path: "archive",
    },
    {
      id: "3",
      title: "Tags",
      icon: "pricetags",
      route: "TagScreen",
    },
    // {
    //   id: "4",
    //   title: "Archive",
    //   icon: "archive",
    //   route: "ArchiveScreen",
    // },
    // {
    //   id: '5',
    //   title: 'All Links - Unified',
    //   icon: 'link',
    //   route: 'Links'
    // }
  ];

  const otherActionMenuItems = [
    {
      id: "1",
      title: "Unread",
      icon: "newspaper-outline",
      route: "Links",
      path: "unread",
    },
    {
      id: "2",
      title: "Untagged",
      icon: "pricetag-outline",
      route: "Links",
      path: "untagged",
    },
    {
      id: "3",
      title: "Shared",
      icon: "share-social-outline",
      route: "Links",
      path: "shared",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor: theme.colors.primary }]}
      onPress={() =>
        navigation.navigate(item.route, {
          path: item.path || "default",
          title: item.title,
        })
      }
    >
      <Ionicons name={item.icon} size={24} color={theme.colors.buttonText} />
      <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
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

      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* <AddLinkButton navigation={navigation} /> */}

        <ScrollView>
          <View
            style={[
              styles.sectionOneContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Quick Access
            </Text>
            <View
              style={[
                styles.listContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <FlatList
                data={quickActionMenuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
                nestedScrollEnabled={true}
                ItemSeparatorComponent={
                  <Divider
                    style={[
                      styles.listDivider,
                      { color: theme.colors.primary },
                    ]}
                  />
                }
              />
            </View>
          </View>
          <View
            style={[
              styles.sectionContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Link Collections
            </Text>
            <View
              style={[
                styles.listContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <FlatList
                data={otherActionMenuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
                nestedScrollEnabled={true}
                ItemSeparatorComponent={
                  <Divider
                    style={[
                      styles.listDivider,
                      { color: theme.colors.primary },
                    ]}
                  />
                }
              />
            </View>
          </View>
        </ScrollView>
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
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
  },
  sectionOneContainer: {
    borderRadius: 12,
  },
  sectionContainer: {
    borderRadius: 12,
    marginTop: 60,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
  },
  listContainer: {
    borderRadius: 12,
    height: "auto",
  },
  listDivider: {
    width: "90%",
    alignSelf: "center",
  },
});

export default HomeScreenList;
