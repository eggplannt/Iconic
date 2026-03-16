import { Platform } from "react-native";

export const Colors = {
  light: {
    background: "#ffffff",
    onBackground: "#1a1a1a",
    primary: "#ff6b00",
    onPrimary: "#ffffff",
    secondary: "#fff5ed",
    onSecondary: "#8c4a00",
    muted: "#f4f4f4",
    onMuted: "#666666",
  },
  dark: {
    background: "#0f0f0f",
    onBackground: "#f5f5f5",
    primary: "#ff8533",
    onPrimary: "#000000",
    secondary: "#251a10",
    onSecondary: "#ffbd80",
    muted: "#1f1f1f",
    onMuted: "#a0a0a0",
  },
};
export type AppColors = typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
