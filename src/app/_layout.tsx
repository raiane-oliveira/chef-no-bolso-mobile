import "../global.css";

import { ShoppingCartContextProvider } from "@/features/add-to-cart/model/shopping-cart-context";
import { AuthenticationContextProvider } from "@/features/auth/model/authentication-context";
import { Navbar } from "@/widgets/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import { useIsDesktop } from "@/shared/hooks/use-is-desktop";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  });

  const isDesktop = useIsDesktop();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthenticationContextProvider>
          <ShoppingCartContextProvider>
            <Navbar />
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="auth/login"
                options={{
                  headerShown: !isDesktop,
                  title: "Entrar",
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  headerShown: !isDesktop,
                  title: "Cadastrar",
                  presentation: "modal",
                }}
              />
            </Stack>
          </ShoppingCartContextProvider>
        </AuthenticationContextProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
