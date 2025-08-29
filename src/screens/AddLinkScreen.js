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
import * as Clipboard from "expo-clipboard";
import LinkdingApi from "../services/LinkdingApi";
import { useTheme } from "@rneui/themed";
import { useShareIntentContext } from "expo-share-intent";
import TagSelector from "../components/TagSelector";

const AddLinkScreen = ({ navigation }) => {
  const { theme } = useTheme();
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

  // console.log("hasShareIntent", hasShareIntent);


  const checkAndPasteClipboardUrl  = async () => {
    // console.log("hasShareIntent", hasShareIntent);
    if (hasShareIntent && shareIntent.text) {
      // console.log("shareIntent:", shareIntent);
      // console.log("shareIntent.text:", shareIntent.text);
      // console.log("shareIntent.webUrl:", shareIntent.webUrl);
      // console.log("shareIntent.meta.Description:", shareIntent.meta.Description);
      // console.log("shareIntent.meta.title:", shareIntent.meta.title);
      setUrl(shareIntent.text);
      checkExistingUrl(shareIntent.text);
      // console.log("isExisting", isExisting);
      // if (isExisting === false) {
      //   setTitle(shareIntent.meta.title);
      //   setDescription(shareIntent.meta.Description);
      // }
      resetShareIntent();
      return;
    }

    const hasUrl = await Clipboard.hasUrlAsync();
    if (hasUrl) {
      const clipboardText = await Clipboard.getStringAsync();
      setUrl(clipboardText);
      checkExistingUrl(clipboardText);
    }
  };

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

      if (checkData.bookmark) {
        // console.log(checkData.bookmark);
        setIsExisting(true);
        // Pre-fill form with existing bookmark data
        const bookmark = checkData.bookmark;
        // console.log(bookmark);
        setTitle(bookmark.title);
        setDescription(bookmark.description);
        setNotes(bookmark.notes || "");
        // setTags(bookmark.tag_names.join(", "));
        setTags(bookmark.tag_names);
        // console.log(bookmark);
        // const existingTags = checkData.bookmark.tag_names.map(tag => ({
        //   label: tag,
        //   value: tag
        // }));
        // setTags(existingTags);
      } else {
        const metadataResponse = await LinkdingApi.checkWebsiteMetadata(
          urlToCheck
        );

        const metadataData = await metadataResponse;
        setIsExisting(false);

        // Pre-fill with metadata from the URL
        // setTitle(metadataData.metadata.title || "");
        // setDescription(metadataData.metadata.description || "");
        // setTitle(shareIntent.meta.title || metadataData.metadata.title || "");
        // setDescription(shareIntent.meta.Description || metadataData.metadata.description || ""); 
        // setTags(metadataData.auto_tags.join(", "));

        if (hasShareIntent) {
          // console.log("shareIntent.meta.title:", shareIntent.meta.title );
          setTitle(shareIntent.meta.title ?? metadataData.metadata.title ?? "");
          setDescription(shareIntent.meta.Description ?? metadataData.metadata.description ?? "");
        } else {
          setTitle(metadataData.metadata.title ?? "");
          setDescription(metadataData.metadata.description ?? "");
        }

        setTags(metadataData.auto_tags);
        // const autoTags = metadataData.auto_tags.map(tag => ({
        //   label: tag,
        //   value: tag
        // }));
        // setTags(autoTags);
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
      // console.log("Formatted URL:", formattedUrl);

      const urlString = typeof url === "object" ? url._j : url;

      const formattedUrl = checkURLFormatting(urlString);

      if (!formattedUrl) return;

      const bookmarkData = {
        url: formattedUrl,
        title: title,
        description: description,
        // tag_names: tags
        //   ? tags
        //       .split(",")
        //       .map((tag) => tag.trim())
        //       .filter((tag) => tag.length > 0)
        //   : [],
        tag_names: tags,
        notes: notes,
        is_archived: false,
        unread: true,
      };

      const response = await LinkdingApi.createBookmark(bookmarkData);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        Alert.alert("Something went wrong, please try again", error.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        setIsSaved(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          Clipboard.setStringAsync("");
          navigation.popToTop();
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding link:", error);
      Alert.alert("Something went wrong, please try again", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkAndPasteClipboardUrl ();
  }, []);

  useEffect(() => {
    if (hasShareIntent && shareIntent.text) {
      setModalVisible(false);
      setIsSaved(false);
      setUrl(shareIntent.text);
      checkExistingUrl(shareIntent.text);
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

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
  }, [navigation, isSubmitting, url, title, description, notes, tags]);

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
                placeholderTextColor={theme.colors.placeholderText}
                // placeholderTextColor={theme.colors.}
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
              placeholderTextColor={theme.colors.placeholderText}
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
              placeholderTextColor={theme.colors.placeholderText}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              color={theme.colors.text}
            />

            {/* <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.text,
                },
              ]}
              placeholder="tag1, tag2, tag3,..."
              placeholderTextColor={theme.colors.placeholderText}
              value={tags}
              onChangeText={setTags}
              color={theme.colors.text}
              autoCapitalize="none"
            /> */}

            <TagSelector tags={tags} setTags={setTags} />

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
              placeholderTextColor={theme.colors.placeholderText}
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
