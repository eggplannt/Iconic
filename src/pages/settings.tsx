import SignOutButton from "@/components/auth/signout-button";
import { View } from "react-native";
export default function SettingsPage() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <View className="h-8" />
      <SignOutButton />
    </View>
  );
}
