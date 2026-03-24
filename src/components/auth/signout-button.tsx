import React from "react";
import { Button, Alert, View, TouchableOpacity, Text } from "react-native";
import { supabase } from "@/utils/supabase";
import { useLoading } from "@/contexts/use-loading";

export default function SignOutButton() {
  const { setLoading } = useLoading();
  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (err) {
      console.error("Sign out error:", err);
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Failed to sign out.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      activeOpacity={0.7}
      className="flex-row items-center justify-center bg-danger rounded-md p-2.5"
    >
      <Text className="text-white text-lg">Sign Out</Text>
    </TouchableOpacity>
  );
}
