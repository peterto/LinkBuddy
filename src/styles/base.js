import { Dimensions } from "react-native";

export const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
};

export const defaultColors = {
  text: "#F9F6EF",
  background: "#010104",
  backgroundPlaceHolder: "#f2f2f2",
  primary: "#3a31d8",
  secondary: "#020024",
  accent: "#0600c2",
  buttonText: "#F9F6EF",
  warning: "#cc0000",
  save: "#4CAF50",
  loading: "#4a9eff",
};

export const darkModeColors = {
  text: "#F9F6EF",
  background: "#010104",
  backgroundPlaceHolder: "#f2f2f2",
  primary: "#3a31d8",
  secondary: "#020024",
  accent: "#0600c2",
  buttonText: "#F9F6EF",
  warning: "#cc0000",
  save: "#4CAF50",
  loading: "#4a9eff",
};

export const lightModeColors = {
  text: "#040316",
  background: "#F9F6EF",
  backgroundPlaceHolder: "#c2c2f0",
  primary: "#2f27ce",
  secondary: "#dddbff",
  accent: "#443dff",
  buttonText: "#F9F6EF",
  warning: "#cc0000",
  save: "#4CAF50",
  loading: "#4a9eff",
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
