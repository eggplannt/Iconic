import { NavigationContainer } from "@react-navigation/native";

import { StatusBar, useColorScheme, View } from "react-native";
import AppTabs from "@/navigation/app-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";
export default function App() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <StatusBar />
      <View className={`flex-1 ${colorScheme === "dark" ? "dark" : ""}`}>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
