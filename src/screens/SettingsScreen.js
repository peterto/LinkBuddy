import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import LinkdingApi from "../services/LinkdingApi";
import { useTheme } from "@rneui/themed";
import useAuthStore from "../store/useAuthStore";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
// import * as DeviceInfo from "react-native-device-info";

const SettingsScreen = ({ navigation }) => {
  const logout = useAuthStore((state) => state.logout);

  const { theme } = useTheme();
  const [userPreferences, setUserPreferences] = useState({
    username: "",
    enableWebhooks: false,
    enableArchive: false,
    theme: "",
    displayMode: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const appVersion = "1.0.0";
  const jwtToken = SecureStore.getItem("jwtToken");
  const baseURL = SecureStore.getItem("baseURL");
  // console.log(baseURL);

  const userPrefs = LinkdingApi.getUserProfile();
  // console.log(userPrefs.tag_search);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    loadDarkModePreference();
  }, []);

  const loadDarkModePreference = async () => {
    const darkMode = await SecureStore.getItem("isDarkMode");
    setIsDarkMode(darkMode === "true");
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await SecureStore.setItem("isDarkMode", newValue.toString());
  };

  const handleLogoutAction = async () => {
    // await SecureStore.deleteItemAsync("jwtToken");
    // await SecureStore.deleteItemAsync("baseURL");
    // await SecureStore.deleteItemAsync("isDarkMode");
    // await SecureStore.deleteItemAsync("isLoggedIn");
    // navigation.navigate("Login");
    const keysToDelete = [
      "jwtToken",
      "baseURL",
      "isDarkMode",
      // "isLoggedIn",
      "links",
      "userPreferences",
      "cachedLinks",
      "tagsList",
      "linksList",
    ];

    await Promise.all(
      keysToDelete.map((key) => SecureStore.deleteItemAsync(key))
    );

    await LinkdingApi.handleLogout();
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Login" }],
    // });
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await LinkdingApi.getUserProfile();
      // const data = await response.json();
      data = await response;
      // console.log(response);
      setUserPreferences({
        username: data.username,
        enableWebhooks: data.enable_webhooks,
        enableArchive: data.enable_archive,
        theme: data.theme,
        displayMode: data.display_mode,
      });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await handleLogoutAction();
  //     navigation.replace("Login");
  //   } catch (error) {
  //     console.log("Error logging out:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await handleLogoutAction();
      // Instead of navigation.replace, set isLoggedIn to false in SecureStore
      await SecureStore.setItem("isLoggedIn", "false");
      // Reset entire navigation state
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "Login" }],
      // });
      // console.log("In logged out screen");

      await logout();

      // navigation.navigate("Login");

      // if (navigationRef.isReady()) {
      //   navigationRef.reset({
      //     index: 0,
      //     routes: [{ name: 'Login' }]
      //   });
      // }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePress = () => {
    const url = "https://linkding.link/";
    Linking.openURL(url);
  };

  const handleEmailPress = () => {
    
    // let deviceId = DeviceInfo.getDeviceId();
    const email = "mailto:linkbuddyapp@gmail.com";
    const subject = "LinkBuddy [Support Request]";
    const body = `App Version: ${appVersion}`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* <View style={styles.section}>
        <View style={styles.darkModeRow}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      <View 
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          >
        </View>
      </View> */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          Server URL
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]} selectable>
          {baseURL}
        </Text>
      </View>

      {/* <View style={styles.section}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Username
        </Text>
        <Text style={[styles.value, {color: theme.colors.text}]}>
          {userPreferences.username}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Theme
        </Text>
        <Text style={[styles.value, {color: theme.colors.text}]}>
          {userPreferences.theme}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Display Mode
        </Text>
        <Text style={[styles.value, {color: theme.colors.text}]}>
          {userPreferences.displayMode}
        </Text>
      </View> */}

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          Webhooks Enabled
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]} selectable>
          {userPreferences.enableWebhooks ? "Yes" : "No"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          Archive Enabled
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]} selectable>
          {userPreferences.enableArchive ? "Yes" : "No"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          App Version
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]} selectable>
          {appVersion}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.2 : 1,
            backgroundColor: theme.colors.background,
          },
        ]}
        onPress={handlePress}
      >
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            More Info About Linkding
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]} selectable>
            {"https://linkding.link/"}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.2 : 1,
            backgroundColor: theme.colors.background,
          },
        ]}
        onPress={handleEmailPress}
      >
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            Send Feedback
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]} selectable>
            linkbuddyapp@gmail.com
          </Text>
        </View>
      </Pressable>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.warning }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutButtonText, { color: theme.colors.text }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#000",
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  darkModeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
});

export default SettingsScreen;
