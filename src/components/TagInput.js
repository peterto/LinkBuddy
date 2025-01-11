import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Input, Chip, useTheme } from "@rneui/themed";
import LinkdingAPI from "../services/LinkdingApi";

const TagInput = ({ value, onTagsChange }) => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(value || []);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputText.length > 0) {
        const data = await LinkdingAPI.searchTags(inputText);
        setSuggestions(data.results || []);
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [inputText]);

  const handleSelectTag = (tag) => {
    const newTags = [...selectedTags, tag.name];
    setSelectedTags(newTags);
    onTagsChange(newTags);
    setInputText("");
    setSuggestions([]);
    // console.log('Selected tags:', selectedTags); // Add this in handleSelectTag function
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <View
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.text,
        },
      ]}
    >
      <Input
        placeholder="Add tags..."
        value={inputText}
        onChangeText={setInputText}
        placeholderTextColor={theme.colors.text}
        color={theme.colors.text}
      />

      <View style={styles.selectedTags}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            title={tag}
            onPress={() => handleRemoveTag(tag)}
            containerStyle={styles.chip}
          />
        ))}
      </View>

      {suggestions.length > 0 && (
        <View style={{ maxHeight: 200 }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectTag(item)}>
                <Text style={{ padding: 10, color: theme.colors.text }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },
  chip: {
    margin: 2,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestion: {
    padding: 8,
  },
  suggestionChip: {
    margin: 2,
  },
});

export default TagInput;
