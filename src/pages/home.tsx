import { useAuth } from "@/contexts/auth-provider";
import { Text, View } from "react-native";
export default function HomePage() {
  const {profile} = useAuth();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-3xl ">hi {profile?.default_name}</Text>
    </View>
  );
}
