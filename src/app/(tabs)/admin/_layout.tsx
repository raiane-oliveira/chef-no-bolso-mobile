import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Administração" }} />
      <Stack.Screen name="products" options={{ title: "Gerenciar Produtos" }} />
      <Stack.Screen
        name="entregadores"
        options={{ title: "Gerenciar Entregadores" }}
      />
    </Stack>
  );
}
