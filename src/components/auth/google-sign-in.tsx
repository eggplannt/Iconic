import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import { useLoading } from "@/contexts/use-loading";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const { setLoading } = useLoading();
  const performOAuth = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL("/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No authentication URL returned.");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success") {
        const url = result.url;
        // Check if Supabase returned the tokens in a hash fragment
        if (url.includes("#access_token=")) {
          const hashFragment = url.split("#")[1];

          const params = new URLSearchParams(hashFragment);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            // console.log(accessToken, refreshToken);
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;
          }
        }
        // Fallback just in case it ever returns a ?code= instead
        else {
          const parsedUrl = Linking.parse(url);
          const code = parsedUrl.queryParams?.code;

          if (code) {
            const { error: sessionError } =
              await supabase.auth.exchangeCodeForSession(code as string);
            if (sessionError) throw sessionError;
          }
        }
      }
    } catch (err) {
      console.error("OAuth error:", err);
      Alert.alert(
        "Sign In Error",
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={performOAuth}
      activeOpacity={0.7}
      className="flex-row items-center justify-center bg-white border border-gray-300 rounded-md p-3 shadow-sm"
      style={{ elevation: 2 }}
    >
      <View className="mr-3">
        {/* Official Google "G" Logo */}
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png",
          }}
          className="w-[22px] h-[22px]"
          resizeMode="contain"
        />
      </View>

      <Text className="text-gray-700 font-medim text-lg">
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
