import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, TextInputProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { supabase } from '@/utils/supabase'; // Adjust import path
import { useThemeColor } from '@/hooks/use-theme-color';
import useColorTheme from '@/hooks/use-color-theme';
import { useAuth } from '@/contexts/auth-provider';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '@/contexts/use-loading';

// --- Types ---
interface AnimatedTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  error?: string;
}

// --- 1. Reusable Animated Input Component ---
const AnimatedTextInput: React.FC<AnimatedTextInputProps> = ({
  label,
  value,
  onChangeText,
  icon,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const focusAnim = useSharedValue<number>(value ? 1 : 0);
  const theme = useColorTheme();

  useEffect(() => {
    focusAnim.value = withTiming(isFocused || value ? 1 : 0, { duration: 200 });
  }, [isFocused, value, focusAnim]);

  const labelStyle = useAnimatedStyle(() => ({
    top: withTiming(focusAnim.value ? -10 : 16, { duration: 150 }),
    left: 12,
    fontSize: withTiming(focusAnim.value ? 12 : 16, { duration: 150 }),
    color: interpolateColor(
      focusAnim.value,
      [0, 1],
      [theme.onMuted, theme.primary] // var(--on-muted) to var(--primary)
    ),
    backgroundColor: focusAnim.value ? theme.background : 'transparent',
    paddingHorizontal: focusAnim.value ? 4 : 0,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusAnim.value,
      [0, 1],
      [error ? theme.danger : theme.muted, error ? theme.danger : theme.muted] // muted/danger to primary
    ),
  }));

  return (
    <View className="mb-6">
      <Animated.View
        className="relative border-2 rounded-xl flex-row items-center px-4 h-14 bg-background"
        style={borderStyle}
      >
        <Animated.Text className="absolute z-10 font-medium" style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          className="flex-1 text-on-background text-base h-full pt-2"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          placeholderTextColor="transparent"
          {...props}
        />
        {icon && <View className="ml-2">{icon}</View>}
      </Animated.View>
      {error ? <Text className="text-danger text-sm mt-1 ml-1">{error}</Text> : null}
    </View>
  );
};

interface ProfileSetupPageProps {
  session: Session;
  onUsernameSet: () => void;
}
// --- 2. Main Onboarding Screen ---
export default function ProfileSetupPage({ session, onUsernameSet }: ProfileSetupPageProps) {
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string>('');
  const theme = useColorTheme();
  const { profile } = useAuth();
  const {setLoading} = useLoading();

  // Debounced Supabase Availability Check
  useEffect(() => {
    if (username.length === 0) {
      setIsAvailable(null);
      setUsernameError('');
      setIsChecking(false);
      return;
    }

    if (username.length < 3) {
      setIsAvailable(null);
      setUsernameError('Username must be at least 3 characters');
      setIsChecking(false);
      return;
    }

    setUsernameError('');
    setIsChecking(true);

    const checkAvailability = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-username', {
          body: { username: username}, // Pass your JSON payload here
        });

        if (error) {
          throw error;
        } else {
          setIsAvailable(data.available)
        }
        if (!data.available) setUsernameError('This username is already taken');
      } catch (err) {
        console.error('Error checking username:', err);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(checkAvailability);
  }, [username]);

  const renderUsernameIcon = (): React.ReactNode => {
    if (isChecking) return <ActivityIndicator color={theme.primary} size="small" />;
    if (isAvailable === true) return <CheckCircle2 color={theme.primary} size={20} />;
    if (isAvailable === false) return <XCircle color={theme.danger} size={20} />;
    return null;
  };

  const isFormValid: boolean = displayName.length > 0 && isAvailable === true;

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <View className="mb-10">
        <Text className="text-3xl font-bold text-on-background mb-2 pt-16">
          Set up your profile
        </Text>
        <Text className="text-base text-on-muted">
          Choose how you'll appear in Iconic.
        </Text>
      </View>

      <AnimatedTextInput
        label="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        autoComplete="name"
      />

      <AnimatedTextInput
        label="Username"
        value={username}
        onChangeText={(text: string) => setUsername(text.replace(/[^a-zA-Z0-9_-]/g, ''))}
        icon={renderUsernameIcon()}
        error={usernameError}
        maxLength={20}
      />

      <View className="flex-1 pt-12">
        <TouchableOpacity
          disabled={!isFormValid}
          className={`h-14 rounded-xl items-center justify-center ${isFormValid ? 'bg-primary' : 'bg-muted'
            }`}
          onPress={async () => {
            setLoading(true)
            const { error } = await supabase.from('profiles').update({ 'username': username, "default_name": displayName }).eq("user_id", session.user.id)
            setLoading(false)
            if (error) throw error;
            onUsernameSet();
          }}
        >
          <Text
            className={`text-lg font-semibold ${isFormValid ? 'text-on-primary' : 'text-on-muted'
              }`}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
