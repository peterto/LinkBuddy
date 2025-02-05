import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { ShareIntentProvider, useShareIntent } from "expo-share-intent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./src/screens/LoginScreenJWT";
import HomeScreenList from "./src/screens/HomeScreenList";
import TagScreen from "./src/screens/TagScreen";
import AddLinkScreen from "./src/screens/AddLinkScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import BookmarkScreen from "./src/screens/BookmarkScreen";
import UnifiedLinksScreen from "./src/screens/UnifiedLinksScreen";
import SplashScreen from "./src/screens/SplashScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";
import { themeRNEUI } from "./src/styles/theme";
import AddLinkButton from "./src/components/AddLinkButton";
// import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import useAuthStore from "./src/store/useAuthStore";
import * as ExpoSplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

// Keep the splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
ExpoSplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const App = () => {
  // Start prefetching when app launches
  // BookmarkCache.prefetchAll();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntent();

  useEffect(() => {
    if (hasShareIntent && isLoggedIn) {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          // console.log(shareIntent.text);
          navigationRef.navigate("AddLinkScreen");
        }
      }, 100);
    }
  }, [hasShareIntent]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(false); // Set to false after checking auth
        await ExpoSplashScreen.hideAsync(); // Hide splash screen
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsSignedIn(false);
        setIsLoading(false);
        await ExpoSplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, []);

  const theme = {
    ...themeRNEUI,
    mode: colorScheme,
  };

  const colors = isDarkMode ? theme.darkColors : theme.lightColors;

  const headerConfig = {
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTransparent: false,
    headerTintColor: colors.text,
    headerTitleStyle: {
      color: colors.text,
    },
    // statusBarColor: colors.background,
    headerTitleAlign: "center",
  };

  const unifiedScreenOptions = {
    ...headerConfig,
    headerLargeTitle: true,
    headerBlurEffect: Platform.OS === "ios" ? "regular" : undefined,
    // headerLargeTitleShadowVisible: false,
    headerStyle: {
      ...headerConfig.headerStyle,
      elevation: 0, // for Android
      shadowOpacity: 0, // for iOS
    },
    contentStyle: {
      backgroundColor: colors.background,
    },
    gestureEnabled: true,
    gestureDirection: "horizontal",
  };

  return (
    // <AuthProvider>
    <ShareIntentProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
              {/* {!isLoggedIn ? ( */}
              {isLoading ? (
                <Stack.Screen
                  name="Splash"
                  component={SplashScreen}
                  options={{ headerShown: false }}
                />
              ) : !isLoggedIn ? (
                <>
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      headerShown: false,
                      gestureEnabled: false, // This disables the back gesture
                      gestureDirection: "horizontal",
                      presentation: "modal",
                      animation: "flip",
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreenList}
                    options={({ navigation }) => ({
                      ...headerConfig,
                      headerShown: true,
                      title: "Bookmarks",
                      // headerLargeTitle: true,
                      headerLargeTitleStyle: {
                        fontSize: 34,
                        fontWeight: "bold",
                        color: colors.text,
                      },
                      headerTitleStyle: {
                        color: colors.text,
                      },
                      // headerTransparent: true,
                      headerBlurEffect:
                        Platform.OS === "ios" ? "regular" : undefined,
                      headerRight: () => (
                        <AddLinkButton navigation={navigation} />
                      ),
                      headerLeft: () => (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Settings")}
                        >
                          <Ionicons
                            name="settings-outline"
                            size={24}
                            color={colors.text}
                          />
                        </TouchableOpacity>
                      ),
                    })}
                  />

                  <Stack.Screen
                    name="Links"
                    component={UnifiedLinksScreen}
                    initialParams={{ path: "all" }} // or 'archive' or 'bytag'
                    options={({ route }) => ({
                      title: route.params?.title || "Your Links",
                      ...unifiedScreenOptions,
                    })}
                  />
                  <Stack.Screen
                    name="TagScreen"
                    component={TagScreen}
                    options={{
                      ...unifiedScreenOptions,
                      title: "Tags",
                    }}
                  />
                  <Stack.Screen
                    name="LinksByTagScreen"
                    component={UnifiedLinksScreen}
                    initialParams={{ path: "bytag" }}
                    options={({ route }) => ({
                      title: route.params?.title || "Tags",
                      ...headerConfig,
                      headerLargeTitle: true,
                      gestureEnabled: true,
                      gestureDirection: "horizontal",
                    })}
                  />
                  <Stack.Screen
                    name="AddLinkScreen"
                    component={AddLinkScreen}
                    options={{
                      title: "Add New Link",
                      ...headerConfig,
                      gestureEnabled: true,
                      presentation: "modal",
                      // animation: "simple_push",
                    }}
                  />
                  <Stack.Screen
                    name="BookmarkScreen"
                    component={BookmarkScreen}
                    options={{
                      title: "Edit Link",
                      ...headerConfig,
                      gestureEnabled: true,
                      presentation: "modal",
                    }}
                  />
                  <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                      headerShown: true,
                      gestureEnabled: true,
                      ...headerConfig,
                    }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </ShareIntentProvider>
    // </AuthProvider>
  );
};

export default App;
