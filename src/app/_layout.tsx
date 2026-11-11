import "../global.css";

import { ShoppingCartContextProvider } from "@/features/add-to-cart/model/shopping-cart-context";
import { AuthenticationContextProvider } from "@/features/auth/model/authentication-context";
import { Navbar } from "@/widgets/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
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
                  headerShown: true,
                  title: "Entrar",
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  headerShown: true,
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
