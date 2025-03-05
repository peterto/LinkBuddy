import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  StatusBar,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LinkdingApi from "../services/LinkdingApi";
import { useTheme } from "@rneui/themed";

const AddTagScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const isDarkMode = true;

  const [tag, setTag] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fix formatting of tag to remove commas and bad symbols
  // Check if tags exist after clean up
  // If it does, return that "tag already exists"
  // If tag doesn't exist add it

  const checkTagFormatting = async (tagToCheck) => {
    tagReformatted = tagToCheck.replaceAll(",");
    return tagReformatted;
  };

  const checkIfTagExists = async (tagToCheck) => {
    try {
      setIsChecking(true);
      const allTagsResponse = await LinkdingApi.getTags();

      if (allTagsResponse.ok) {
        // Parse the response if it's a string
        const parsedResponse =
          typeof allTagsResponse === "string"
            ? JSON.parse(allTagsResponse)
            : allTagsResponse;

        const formattedTags = parsedResponse.results.map((tag) => tag.name);

        // console.log("Parsed Response", parsedResponse);

        // console.log("Formatted tags:", formattedTags);

        // Check if the tag exists
        // const tagExists = formattedTags.some((tag) => tag.value === tagToCheck);
        const tagExists = formattedTags.includes(tagToCheck);
        // console.log("tagExists", tagExists);
        return tagExists;
      }
    } catch (error) {
      console.error("Error checking tag:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const addTag = async (tagToCheck) => {
    LinkdingApi.createTag(tagToCheck);
  };

  const handleTagChange = async () => {
    setTag(text);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // const tagExists = checkTagFormatting(urlString);
      // const tagExists = checkIfTagExists(tag);

      // console.log("Tag Exists: ", tagExists);

      // if (tagExists) {
      //   setIsExisting(true);
      //   return;
      // } else {

      const response = await LinkdingApi.createTag(tag);

      if (!response) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        Alert.alert("Something went wrong, please try again", error.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response) {
        setIsSaved(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          // navigation.goBack();
          navigation.navigate("TagScreen", { refresh: true });
        }, 1500);
      }
      // }
    } catch (error) {
      console.error("Error adding link:", error);
      Alert.alert("Something went wrong, please try again", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      setModalVisible(false);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.text }]}>
            Close
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ marginRight: 15 }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.loading} />
          ) : (
            <Text
              style={[styles.headerButtonText, { color: theme.colors.text }]}
            >
              Save
            </Text>
          )}
        </Pressable>
      ),
    });
  }, [navigation, isSubmitting, tag]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={100}
    >
      <StatusBar
        animated={true}
        backgroundColor="transparent"
        translucent={true}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        keyboardShouldPersistTaps="always"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <View style={styles.tagContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.tagInput,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.text,
                  },
                ]}
                placeholder="Tag"
                placeholderTextColor={theme.colors.placeholderText}
                value={tag}
                onChangeText={setTag}
                autoCapitalize="none"
                color={theme.colors.text}
                autoCorrect={false}
                keyboardType="default"
              />
              {isChecking && (
                <ActivityIndicator style={styles.icon} color="#888" />
              )}
              {isExisting && !isChecking && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="green"
                  style={styles.icon}
                />
              )}
              {isSaved && (
                <Ionicons
                  name="save-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
              )}
            </View>

            {/* <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="Tag"
              placeholderTextColor={theme.colors.placeholderText}
              value={title}
              onChangeText={setTitle}
              color={theme.colors.text}
            /> */}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                isExisting && styles.buttonUpdate,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.text} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.colors.buttonText },
                    isExisting && {
                      backgroundColor: theme.colors.save,
                      color: theme.colors.buttonText,
                    },
                  ]}
                >
                  {isExisting ? "Update Tag" : "Add Tag"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={50}
              color={theme.colors.save}
            />
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              {isExisting
                ? "Tag updated successfully"
                : "Tag added successfully"}
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 20,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderColor: "#333",
    backgroundColor: "#2a2a2a",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonUpdate: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerButtonText: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  icon: {
    paddingLeft: "2%",
    paddingRight: "2%",
  },
});

export default AddTagScreen;
