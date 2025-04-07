// app/innerLayout.tsx
import { SplashScreen, Stack } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function InnerLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    SplashScreen.preventAutoHideAsync();
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth/loginScreen" />
      )}
    </Stack>
  );
}
