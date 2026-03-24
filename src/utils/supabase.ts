import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase-types";

export const supabase = createClient<Database>(
	process.env.EXPO_PUBLIC_SUPABASE_URL!,
	process.env.EXPO_PUBLIC_SUPABASE_KEY!,
	{
		auth: {
			storage: AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
			lock: processLock,
		},
	},
);

export const fetchCurrentUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User is not logged in:", error?.message);
    return null;
  }

  // Here is your Auth ID! It is a UUID string.
  console.log("The User ID is:", user.id); 
  return user.id;
};
