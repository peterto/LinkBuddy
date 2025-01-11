import { View, StyleSheet, Linking, Button } from "react-native";
import { useTheme } from "@rneui/themed";

const MoreInfo = () => {
  const { theme } = useTheme();

  const handleMoreInfoLinkText = () => {
    const url = "https://linkding.link/";
    Linking.openURL(url);
  };

  return (
    <View style={[styles.moreInfoLinkView]}>
      <Button
        title="A selfhosted instance of LinkDing is required. More information here."
        onPress={handleMoreInfoLinkText}
        color={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  moreInfoLinkView: {
    margin: 15,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default MoreInfo;
