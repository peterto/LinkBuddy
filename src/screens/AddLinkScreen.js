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
  useColorScheme,
  StatusBar,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import LinkdingApi from "../services/LinkdingApi";
import { useTheme } from "@rneui/themed";
import TagInput from "../components/TagInput";
import { useShareIntentContext } from "expo-share-intent";
// import { Pressable } from "react-native-gesture-handler";

const AddLinkScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const isDarkMode = true;

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { hasShareIntent, shareIntent, resetShareIntent } =
    useShareIntentContext();


  // const checkAndPasteClipboardUrl = async () => {
  //   const hasUrl = await Clipboard.hasUrlAsync();
  //   if (hasUrl) {
  //     const clipboardText = await Clipboard.getStringAsync();
  //     setUrl(clipboardText);
  //     checkExistingUrl(clipboardText);
  //   }
  // };

  const checkAndPasteClipboardUrl = async () => {
    if (hasShareIntent && shareIntent.text) {
      setUrl(shareIntent.text);
      checkExistingUrl(shareIntent.text);
      resetShareIntent();
      return;
    }

    const hasUrl = await Clipboard.hasUrlAsync();
    if (hasUrl) {
      const clipboardText = await Clipboard.getStringAsync();
      setUrl(clipboardText);
      checkExistingUrl(clipboardText);
    }
  }

  // const fetchCopiedText = async () => {
  //   const text = await Clipboard.getString();
  //   setCopiedText(text);
  // };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    // setCopiedText(text);
    return text;
  };

  const checkURLFormatting = (text) => {
    let formattedUrl = text.trim();
    if (formattedUrl && !formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    return formattedUrl;
  };

  const checkExistingUrl = async (urlToCheck) => {
    urlToCheck = checkURLFormatting(urlToCheck);
    try {
      setIsChecking(true);

      const checkResponse = await LinkdingApi.checkWebsiteMetadata(urlToCheck);

      const checkData = await checkResponse;
      // console.log(checkData);
      // const clipboardData = await fetchCopiedText();
      // console.log(clipboardData);

      //   if (checkData.results && checkData.results.length > 0) {
      if (checkData.bookmark) {
        // console.log(checkData.bookmark);
        setIsExisting(true);
        // Pre-fill form with existing bookmark data
        const bookmark = checkData.bookmark;
        // console.log(bookmark);
        setTitle(bookmark.title);
        setDescription(bookmark.description);
        setNotes(bookmark.notes || "");
        setTags(bookmark.tag_names.join(", "));
      } else {
        const metadataResponse = await LinkdingApi.checkWebsiteMetadata(
          urlToCheck
        );

        const metadataData = await metadataResponse;
        setIsExisting(false);

        // Pre-fill with metadata from the URL
        setTitle(metadataData.metadata.title || "");
        setDescription(metadataData.metadata.description || "");
        setTags(metadataData.auto_tags.join(", "));
        setNotes("");
      }
    } catch (error) {
      console.error("Error checking URL:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUrlChange = (text) => {
    setUrl(text);
    setIsSaved(false);
    if (text.length > 5) {
      checkExistingUrl(text);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const isUpdating = isExisting; // Store the state

    try {
      setIsSubmitting(true);

      // console.log("Form values being submitted:");
      // console.log("URL:", url);
      // console.log("Title:", title);
      // console.log("Description:", description);
      // console.log("Tags:", tags);
      // console.log("Notes:", notes);

      // console.log("Original URL:", url);
      // const formattedUrl = checkURLFormatting(url);
      // console.log("Formatted URL:", formattedUrl);

      const urlString = typeof url === "object" ? url._j : url;
      // console.log("Original URL:", urlString);

      const formattedUrl = checkURLFormatting(urlString);
      // console.log("Formatted URL:", formattedUrl);

      if (!formattedUrl) return;

      const bookmarkData = {
        url: formattedUrl,
        title: title,
        description: description,
        tag_names: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        notes: notes,
        is_archived: false,
        unread: true,
      };

      const response = await LinkdingApi.createBookmark(bookmarkData);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        // console.log("Response ok, showing modal");
        setIsSaved(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          // navigation.goBack();
          navigation.popToTop();
          // navigation.goBack({ refresh: onRefresh });
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkAndPasteClipboardUrl();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          {/* <Ionicons
            name="close-outline"
            size={24}
            color={theme.colors.primary}
          /> */}
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
            // <Ionicons name="save-outline" size={24} color="#0A84FF" />
            // <Ionicons
            //   name="save-outline"
            //   size={24}
            //   color={theme.colors.primary}
            // />
            <Text
              style={[styles.headerButtonText, { color: theme.colors.text }]}
            >
              Save
            </Text>
          )}
        </Pressable>
      ),
    });
  }, [navigation, isSubmitting, url, title, description, notes, tags]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior="padding"
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
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <View style={styles.urlContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.urlInput,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.text,
                  },
                ]}
                placeholder="URL"
                placeholderTextColor={theme.colors.placeholderTextColor}
                value={url}
                onChangeText={handleUrlChange}
                autoCapitalize="none"
                color={theme.colors.text}
                autoCorrect={false}
                keyboardType="url"
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

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="Title"
              placeholderTextColor={theme.colors.placeholderTextColor}
              value={title}
              onChangeText={setTitle}
              color={theme.colors.text}
            />

            <TextInput
              style={[
                styles.input,
                { height: 100 },
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="Description"
              placeholderTextColor={theme.colors.placeholderTextColor}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              color={theme.colors.text}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="Tags (comma-separated)"
              placeholderTextColor={theme.colors.placeholderTextColor}
              value={tags}
              onChangeText={setTags}
              color={theme.colors.text}
            />

            <TextInput
              style={[
                styles.input,
                { height: 150 },
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="Notes"
              placeholderTextColor={theme.colors.placeholderTextColor}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              color={theme.colors.text}
            />

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
                  {isExisting ? "Update Link" : "Add Link"}
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
                ? "Bookmark updated successfully"
                : "Bookmark added successfully"}
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
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  urlInput: {
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

export default AddLinkScreen;
