import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const AddLinkButton = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      // style={styles.addButton}
      onPress={() => navigation.navigate("AddLinkScreen")}
    >
      <Ionicons name="add-circle-outline" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
});

export default AddLinkButton;
