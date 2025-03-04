import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import DropdownSelect from "react-native-input-select";
import LinkdingApi from "../services/LinkdingApi";
import { Ionicons } from "@expo/vector-icons";

const TagSelector = ({ tags, setTags }) => {
  const { theme } = useTheme();
  const [tagOptions, setTagOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addTag = async (searchTerm) => {
    setTagOptions([...tagOptions, { label: searchTerm, value: searchTerm }]);
    LinkdingApi.createTag(searchTerm);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await LinkdingApi.getTags();

        // Keep existing tags while updating
        const currentTags = tags || [];

        const formattedTags = response.results.map((tag) => ({
          label: tag.name,
          value: tag.name,
        }));

        // Sort tags with current selection preserved
        const sortedTags = formattedTags.sort((a, b) => {
          const aSelected = currentTags.includes(a.value);
          const bSelected = currentTags.includes(b.value);
          if (aSelected && !bSelected) return -1;
          if (!aSelected && bSelected) return 1;
          return a.label.localeCompare(b.label);
        });

        setTagOptions(sortedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [tags]);

  return (
    <DropdownSelect
      // label="Tags"
      placeholder="Select or add tags..."
      placeholderStyle={{
        color: theme.colors.placeholderText,
        fontSize: 16,
      }}
      options={tagOptions}
      selectedValue={tags}
      onValueChange={(itemValue) => setTags(itemValue)}
      // onChangeText={setTags}
      isMultiple
      isSearchable
      dropdownStyle={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.text,
        // borderWidth: 0,
      }}
      dropdownIconStyle={
        {
          // backgroundColor: theme.colors.text,
          // color: "white",
          // borderColor: theme.colors.text
          // color: theme.colors.text
          // backgroundColor: "yellow",
          // paddingBottom: 200,
          // paddingVertical: -5,
          // paddingHorizontal: 5,
          // minHeight: 40,
          // borderColor: "green",
          // alignSelf: "center",
          // marginRight: "auto",
          // marginLeft: "auto",
          // left: 0
        }
      }
      dropdownIcon={
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            // paddingRight: 10
          }}
        >
          <Ionicons
            name="chevron-down-outline"
            color={theme.colors.text}
            size={24}
          />
        </View>
      }
      listControls={{
        // hideSelectAll: true,
        // unselectAllText: "Select"
        keyboardShouldPersistTaps: "always",
      }}
      checkboxControls={{
        // checkboxSize: 10
        checkboxLabelStyle: {
          color: theme.colors.text,
        },
      }}
      modalControls={{
        modalBackgroundStyle: {
          // backgroundColor: theme.colors.background
        },
        modalOptionsContainerStyle: {
          backgroundColor: theme.colors.primary,
        },
        modalText: {
          backgroundColor: theme.colors.text,
        },
        modalProps: {
          // transparent: false,
        },
      }}
      selectedItemStyle={{
        color: theme.colors.text,
        // backgroundColor: theme.colors.text,
      }}
      searchControls={{
        searchCallback: (value) => setSearchTerm(value),
        textInputStyle: {
          color: theme.colors.text,
          fontWeight: "500",
          fontSize: 16,
          // minHeight: 10,
          // paddingVertical: 10,
          // paddingHorizontal: 5,
          // width: '70%',
          // textAlign: 'center',
          backgroundColor: theme.colors.background,
          // marginRight: 30,
        },
        textInputContainerStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // marginRight: 100,
        },
        textInputProps: {
          placeholder: "Search or Add Tags",
          placeholderTextColor: theme.colors.text,
          clearButtonMode: "while-editing",
          // onChangeText: (text) => setSearchTerm(text)
        },
      }}
      listEmptyComponent={
        <View
          style={{
            backgroundColor: theme.colors.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Pressable
            onPress={() => addTag(searchTerm)}
            style={{
              backgroundColor: theme.colors.save,
              borderRadius: 5,
              width: 120,
              padding: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                textAlign: "center",
                fontSize: 20,
              }}
            >
              Add tag
            </Text>
          </Pressable>
        </View>
      }
      listComponentStyles={{
        listEmptyComponentStyle: {
          color: "red",
        },
        itemSeparatorStyle: {
          opacity: 0,
          borderColor: theme.colors.background,
          // borderWidth: 2,
          backgroundColor: theme.colors.primary,
        },
        sectionHeaderStyle: {
          padding: 10,
          backgroundColor: theme.colors.primary,
        },
      }}
      primaryColor={theme.colors.primary}
    />
  );
};

export default TagSelector;
