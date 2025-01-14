import { Dimensions } from "react-native";

export const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
};

export const defaultColors = {
  text: "#F9F6EF",
  background: "#010104",
  backgroundPlaceHolder: "#F2F2F2",
  primary: "#3A31D8",
  secondary: "#020024",
  accent: "#0600C2",
  buttonText: "#F9F6EF",
  warning: "#CC0000",
  save: "#4CAF50",
  loading: "#4A9EFF",
  edit: "#2196F3",
  archive: "#4CAF50",
  delete: "#FF0000",
};

export const darkModeColors = {
  text: "#F9F6EF",
  background: "#010104",
  backgroundPlaceHolder: "#F2F2F2",
  primary: "#3A31D8",
  secondary: "#020024",
  accent: "#0600C2",
  buttonText: "#F9F6EF",
  warning: "#CC0000",
  save: "#4CAF50",
  loading: "#4A9EFF",
  edit: "#0D47A1",
  archive: "#1B5E20",
  delete: "#B71C1C",
};

export const lightModeColors = {
  text: "#040316",
  background: "#F9F6EF",
  backgroundPlaceHolder: "#C2C2F0",
  primary: "#2F27CE",
  secondary: "#DDDBFF",
  accent: "#443DFF",
  buttonText: "#F9F6EF",
  warning: "#CC0000",
  save: "#4CAF50",
  loading: "#4A9EFF",
  edit: "#2196F3",
  archive: "#4CAF50",
  delete: "#FF0000",
};

export const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

export const fonts = {
  sm: 12,
  md: 18,
  lg: 28,
  primary: "Cochin",
};
