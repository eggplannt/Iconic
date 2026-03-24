import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "@/pages/home";
import SettingsPage from "@/pages/settings";

export type RootStackParamList = {
  Settings: undefined;
  Home: undefined;
};

// 2. Map names to actual components
const SCENE_COMPONENTS: Record<
  keyof RootStackParamList,
  React.ComponentType<any>
> = {
  Settings: SettingsPage,
  Home: HomePage,
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * @param initialPage - Must be a valid key from RootStackParamList
 */
export default function PageStack<T extends keyof RootStackParamList>(
  initialPage: T,
  initialParams?: RootStackParamList[T],
) {
  return () => (
    <Stack.Navigator
      initialRouteName={initialPage}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {(
        Object.entries(SCENE_COMPONENTS) as [
          keyof RootStackParamList,
          React.ComponentType<any>,
        ][]
      ).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          initialParams={name === initialPage ? initialParams : undefined}
        />
      ))}
    </Stack.Navigator>
  );
}
