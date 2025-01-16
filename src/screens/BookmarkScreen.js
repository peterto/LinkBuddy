import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Pressable,
  Modal,
} from "react-native";
// import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LinkdingApi from "../services/LinkdingApi";
import { useTheme, Button, Chip } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const BookmarkScreen = ({ route }) => {
  const { theme } = useTheme();
  const isDarkMode = useColorScheme() === "dark";
  const bookmarkID = route.params.bookmark;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
    notes: "",
    is_archived: false,
    unread: false,
    shared: false,
  });

  useEffect(() => {
    const fetchBookmarkDetails = async () => {
      try {
        const response = await LinkdingApi.getBookmarkDetails(
          route.params.bookmark
        );

        if (response) {
          const bookmark = await response;
          setFormData({
            url: bookmark.url || "",
            title: bookmark.title || "",
            description: bookmark.description || "",
            tags: bookmark.tag_names?.join(", ") || "",
            notes: bookmark.notes || "",
            is_archived: bookmark.is_archived || false,
            unread: bookmark.unread || false,
            shared: bookmark.shared || false,
          });
        } else {
          throw new Error("Failed to fetch bookmark details");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkDetails();
  }, [bookmarkID]);

  const updateBookmark = async () => {
    setIsLoading(true);

    // try {
    //   console.log(formData.tags);
    //   const response = await fetch(`${baseURL}/api/bookmarks/${bookmarkID}/`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: jwtToken,
    //     },
    //     body: JSON.stringify({
    //       ...formData,
    //       tag_names: formData.tags
    //         .split(",")
    //         .map((tag) => tag.trim())
    //         .filter((tag) => tag),
    //     }),
    //   });

    const bookmarkData = {
      ...formData,
      tag_names: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    // const bookmarkData = {
    //   url: formData.url,
    //   title: formData.title,
    //   description: formData.description,
    //   notes: formData.notes,
    //   tag_names: formData.tags
    //     .split(",")
    //     .map((tag) => tag.trim())
    //     .filter((tag) => tag),
    //   is_archived: formData.is_archived,
    //   unread: formData.unread,
    //   shared: formData.shared,
    // };

    try {
      const response = await LinkdingApi.updateBookmark(
        bookmarkID,
        bookmarkData
      );

      // const updatedData = {
      //   ...formData,
      //   tag_names: formData.tags
      //     .split(",")
      //     .map((tag) => tag.trim())
      //     .filter((tag) => tag),
      // };

      // const response = await LinkdingApi.updateBookmark(
      //   bookmarkID,
      //   updatedData
      // );
      // if (route.params?.onUpdate) {
      //   route.params.onUpdate();
      // }

      // console.log(bookmarkData);

      if (response) {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 1500);
      } else {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBookmark = async () => {
    Alert.alert(
      "Delete Bookmark",
      "Are you sure you want to delete this bookmark?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await LinkdingApi.deleteBookmark(bookmarkID);
              if (response) {
                Alert.alert("Success", "Bookmark deleted successfully");
                navigation.goBack();
              } else {
                throw new Error("Failed to delete bookmark");
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        // <Button
        //   type="clear"
        //   onPress={() => navigation.goBack()}
        //   title="Cancel"
        //   disabled={isLoading}
        //   titleStyle={{ color: theme.colors.text }}
        // />
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
        // <Button
        //   type="clear"
        //   onPress={updateBookmark}
        //   title="Update"
        //   disabled={isLoading}
        //   // type="outline"
        //   titleStyle={{ color: theme.colors.text }}
        //   // color={ theme.colors.text }
        //   // style={[{ color: theme.colors.text }]}
        // />
        <Pressable
          onPress={updateBookmark}
          disabled={isLoading}
          style={{ marginRight: 15 }}
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.text }]}>
            {isLoading ? <ActivityIndicator color="white" /> : "Update"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isLoading, formData]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
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
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
        {/* <Text style={[styles.inputTitleText, { color: theme.colors.text }]}>
          URL
        </Text> */}
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.text, color: theme.colors.text },
          ]}
          value={formData.url}
          onChangeText={(text) => setFormData({ ...formData, url: text })}
          placeholder="URL"
          placeholderTextColor={theme.colors.placeholderTextColor}
          autoCapitalize="none"
          color={theme.colors.text}
          autoCorrect={false}
          keyboardType="url"
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.text, color: theme.colors.text },
          ]}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Title"
          placeholderTextColor={theme.colors.placeholderTextColor}
          color={theme.colors.text}
        />
        <TextInput
          style={[
            styles.input,
            { height: 100 },
            { borderColor: theme.colors.text, color: theme.colors.text },
          ]}
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          placeholder="Description"
          placeholderTextColor={theme.colors.placeholderTextColor}
          multiline
          numberOfLines={4}
          color={theme.colors.text}
        />

        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.text, color: theme.colors.text },
          ]}
          value={formData.tags}
          onChangeText={(text) => setFormData({ ...formData, tags: text })}
          placeholder="tag1, tag2, tag3,..."
          placeholderTextColor={theme.colors.placeholderTextColor}
          color={theme.colors.text}
          autoCapitalize="none"
        />
        <TextInput
          style={[
            styles.input,
            { height: 150 },
            { borderColor: theme.colors.text, color: theme.colors.text },
          ]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Notes"
          placeholderTextColor={theme.colors.placeholderTextColor}
          multiline
          numberOfLines={4}
          color={theme.colors.text}
        />

        <View
          style={[styles.toggleContainer, { borderColor: theme.colors.text }]}
        >
          <Chip
            title="Archived"
            type={formData.is_archived ? "solid" : "outlined"}
            onPress={() =>
              setFormData({ ...formData, is_archived: !formData.is_archived })
            }
            buttonStyle={
              isDarkMode && {
                backgroundColor: formData.is_archived
                  ? "#2196F3"
                  : "transparent",
              }
            }
          />
          <Chip
            title="Unread"
            type={formData.unread ? "solid" : "outlined"}
            onPress={() =>
              setFormData({ ...formData, unread: !formData.unread })
            }
            buttonStyle={
              isDarkMode && {
                backgroundColor: formData.unread ? "#2196F3" : "transparent",
              }
            }
          />
          <Chip
            title="Shared"
            type={formData.shared ? "solid" : "outlined"}
            onPress={() =>
              setFormData({ ...formData, shared: !formData.shared })
            }
            buttonStyle={
              isDarkMode && {
                backgroundColor: formData.shared ? "#2196F3" : "transparent",
              }
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          {/* <Button
            mode="contained"
            onPress={updateBookmark}
            disabled={isLoading}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: theme.colors.save,
                color: theme.colors.buttonText,
              },
            ]}

          >
            {isLoading ? <ActivityIndicator color="white" /> : "Update"}
          </Button> */}
          <Button
            mode="contained"
            onPress={deleteBookmark}
            disabled={isLoading}
            buttonStyle={[
              styles.deleteButton,
              {
                backgroundColor: theme.colors.warning,
                color: theme.colors.buttonText,
              },
            ]}
            textStyle
          >
            Delete
          </Button>
        </View>
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
              Bookmark updated successfully
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
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    minHeight: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  inputTitleText: {
    borderColor: "#ddd",
    padding: 3,
    marginBottom: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 32,
  },
  button: {
    borderRadius: 10,
  },
  deleteButton: {
    borderRadius: 10,
    margin: 16,
    marginBottom: Platform.OS === "ios" ? 40 : 16, 
  },
  headerButtonText: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
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
  },
});

export default BookmarkScreen;
