import { NavigationContainer } from "@react-navigation/native";

import { StatusBar, useColorScheme, View } from "react-native";
import RootNavigator from "@/navigation/app-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";
import { LoadingProvider } from "@/contexts/use-loading";
import { AuthProvider } from "@/contexts/auth-provider";
export default function App() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <StatusBar />
      <View className={`flex-1 ${colorScheme === "dark" ? "dark" : ""}`}>
        <LoadingProvider>
          <NavigationContainer>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </NavigationContainer>
        </LoadingProvider>
      </View>
    </SafeAreaProvider>
  );
}
