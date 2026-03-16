import { Colors } from "@/constants/theme";
import * as reactNative from "react-native";

export default function useColorTheme() {
  const cs = reactNative.useColorScheme();

  return Colors[cs ?? "dark"];
}
