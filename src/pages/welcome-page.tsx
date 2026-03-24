import GoogleSignIn from "@/components/auth/google-sign-in";
import { View, Text } from "react-native";

export default function() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-primary text-4xl">Welcome to Iconic</Text>
      <View className="h-20" />
      <GoogleSignIn />
    </View>
  );
}
