import { RorkErrorBoundary } from "../.rorkai/rork-error-boundary";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RorkErrorBoundary><RootLayoutNav /></RorkErrorBoundary>;
}

function RootLayoutNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTintColor: Colors.light.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="barber/[id]" 
            options={{ 
              title: "Barber Profile",
              animation: "slide_from_right",
            }} 
          />
          <Stack.Screen 
            name="appointment/new" 
            options={{ 
              title: "Book Appointment",
              animation: "slide_from_bottom",
            }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="auth/login" 
            options={{ 
              title: "Login",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth/register" 
            options={{ 
              title: "Register",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="auth/role-select" 
            options={{ 
              title: "Select Role",
              headerShown: false,
            }} 
          />
        </>
      )}
    </Stack>
  );
}