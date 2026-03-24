import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PageStack from "@/navigation/page-stack";
import useColorTheme from "@/hooks/use-color-theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/auth-provider";
import WelcomePage from "@/pages/welcome-page";
const Tabs = createBottomTabNavigator();

export default function RootNavigator() {
  const { session, isLoading } = useAuth();
  const colorScheme = useColorTheme();

  // 1. Still fetching session or profile? Show a spinner.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator className="color-on-background" size="large"/>
      </View>
    );
  }

  // 2. No session? Lock them to the Auth flow.
  if (!session) {
    return <WelcomePage />;
  }

  const tabBarIconSize = 30;
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colorScheme.muted,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        component={PageStack("Home")}
        options={{
          title: "Iconic",
          tabBarLabel: "",
          headerShown: true,
          headerTitleStyle: {
            color: colorScheme.primary,
            fontSize: 32
          },
          headerStyle: {
            backgroundColor: colorScheme.background,
          },
          tabBarIcon: ({ focused }) => {
            return IconSymbol({
              name: focused ? "house.fill" : "house",
              size: tabBarIconSize,
              color: colorScheme.onBackground,
              style: {
                margin: "auto",
              },
            });
          },
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={PageStack("Settings")}
        options={{
          title: "Settings",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return IconSymbol({
              name: focused ? "gearshape.fill" : "gearshape",
              size: tabBarIconSize,
              color: colorScheme.onBackground,
              style: {
                margin: "auto",
              },
            });
          },
        }}
      />
    </Tabs.Navigator>
  );
}
