import React, { useRef } from "react";
import { WebView } from "react-native-webview";
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  StatusBar,
  Linking,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const WebViewScreen = ({ route }) => {
  const { url } = route.params;
  //   const isDarkMode = useColorScheme() === 'dark';
  const isDarkMode = true;
  const webViewRef = useRef(null);

  // Inject CSS for dark mode
  const darkModeScript = `
    document.body.style.backgroundColor = '#1a1a1a';
    document.body.style.color = '#ffffff';
    document.querySelectorAll('a').forEach(a => a.style.color = '#66b3ff');
  `;

  const shareUrl = async () => {
    try {
      await Share.share({
        message: url,
        url: url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openInBrowser = () => {
    Linking.openURL(url);
  };

  const NavigationControls = () => (
    <View style={styles.navigationBar}>
      <TouchableOpacity onPress={() => webViewRef.current.goBack()}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => webViewRef.current.goForward()}>
        <Ionicons name="arrow-forward" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => webViewRef.current.reload()}>
        <Ionicons name="refresh" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={openInBrowser}>
        <Ionicons name="open-outline" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={shareUrl}>
        <Ionicons name="share-outline" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <StatusBar
        backgroundColor={isDarkMode ? "#121212" : "#f5f5f5"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {/* <NavigationControls /> */}
      <WebView
        source={{ uri: url }}
        // injectedJavaScript={isDarkMode ? darkModeScript : ""}
        // injectedJavaScriptBeforeContentLoaded={isDarkMode ? darkModeScript : ""}
        backgroundColor={isDarkMode ? "#1a1a1a" : "#ffffff"}
        pullToRefreshEnabled={true}
        allowsBackForwardNavigationGestures={true}
        // menuItems={[
        //   { label: "Tweet", key: "tweet" },
        //   { label: "Save for later", key: "saveForLater" },
        // ]}
        // onCustomMenuSelection={(webViewEvent) => {
        //   const { label } = webViewEvent.nativeEvent; // The name of the menu item, i.e. 'Tweet'
        //   const { key } = webViewEvent.nativeEvent; // The key of the menu item, i.e. 'tweet'
        //   const { selectedText } = webViewEvent.nativeEvent; // Text highlighted
        // }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  darkSafeArea: {
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
});

export default WebViewScreen;
