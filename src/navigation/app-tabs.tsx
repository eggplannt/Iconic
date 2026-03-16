import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PageStack from "@/navigation/page-stack";
import useColorTheme from "@/hooks/use-color-theme";
import { StyleSheet } from "react-native";
const Tabs = createBottomTabNavigator();

export default function AppTabs() {
  const colorScheme = useColorTheme();
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
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        component={PageStack("Home")}
        options={{
          title: "",
          headerShown: false,
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
        name="ProfileTab"
        component={PageStack("Profile")}
        options={{
          title: "",
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
