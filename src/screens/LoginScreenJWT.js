import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinkdingApi from "../services/LinkdingApi";
import MoreInfo from "../components/MoreInfo";
import { useTheme, Button } from "@rneui/themed";
import * as SecureStore from "expo-secure-store";
import useAuthStore from "../store/useAuthStore";


const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [baseURL, setBaseURL] = useState("");
  const [authToken, setAuthToken] = useState("");

  // useEffect(() => {
  //   clearPersistedState();
  // }, []);

  const login = useAuthStore((state) => state.login);
  const handleLogin = async () => {
    // First clear existing data
    const keysToDelete = [
      "jwtToken",
      "baseURL",
      "isDarkMode",
      "isLoggedIn",
      "tagsList",
      "linksList",
      "links",
      "cachedLinks",
    ];

    await Promise.all(
      keysToDelete.map((key) => SecureStore.deleteItemAsync(key))
    );

    const loginSuccess = await LinkdingApi.handleLogin(baseURL, authToken);

    if (loginSuccess) {
      await LinkdingApi.updateBaseUrl();

      login();
      
    } else {
      alert("Invalid server url/auth token");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.loginContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Linkbuddy for Linkding
        </Text>
        <TextInput
          placeholder="Server URL (e.g. https://linkding.example.com)"
          onChangeText={setBaseURL}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.text,
              color: theme.colors.text,
            },
          ]}
          placeholderTextColor={theme.colors.text}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <TextInput
          placeholder="Authorization Token"
          secureTextEntry={true}
          onChangeText={setAuthToken}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.text,
              color: theme.colors.text,
            },
          ]}
          placeholderTextColor={theme.colors.text}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          style={[
            styles.loginButton,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={handleLogin}
          containerStyle={{
            marginTop: 10,
            borderRadius: 10,
          }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            // padding: 15,
            borderWidth: 0,
          }}
          titleStyle={{
            color: theme.colors.primary,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          <Text
            style={[
              styles.loginButtonText,
              {
                backgroundColor: theme.colors.primary,
                color: theme.colors.buttonText,
              },
            ]}
          >
            Login
          </Text>
        </Button>
        <MoreInfo />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    // backgroundColor: theme.colors.primary,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#000",
  },
  loginButton: {
    // backgroundColor: "#007AFF",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    // color: "#fff",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
