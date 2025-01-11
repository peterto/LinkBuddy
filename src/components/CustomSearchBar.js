import { SearchBar, useTheme } from "@rneui/themed";
import { StyleSheet } from "react-native";

const CustomSearchBar = ({ searchQuery, onChangeText }) => {
  const { theme } = useTheme();

  return (
    <SearchBar
      // platform="ios"
      placeholder="URL, title, summary, note, #tag..."
      onChangeText={onChangeText}
      value={searchQuery}
      containerStyle={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      inputContainerStyle={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.text,
        },
      ]}
      inputStyle={{
        color: theme.colors.text,
      }}
      placeholderTextColor={theme.colors.text}
      searchIcon={{ type: "ionicon", name: "search", color: theme.colors.text }}
      clearIcon={{ type: "ionicon", name: "close", color: theme.colors.text }}
      showCancel={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 10,
  },
  inputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 1,
  },
});

export default CustomSearchBar;
