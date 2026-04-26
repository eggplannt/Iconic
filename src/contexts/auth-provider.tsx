import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase'; // Adjust path
import { Database } from '@/utils/supabase-types'; // Adjust path

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean
  fetchProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  isLoading: false,
  fetchProfile: async (userId: string) => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true)
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setIsLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return subscription.unsubscribe;
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single(); // Grab the exact row

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false); // Only stop loading once the profile is secured
    }
  };

  return (
    <AuthContext.Provider value={{ session, profile, isLoading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook for easy access in components
export const useAuth = () => useContext(AuthContext);
