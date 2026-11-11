import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Ops!" }} />
      <View className="flex-1 items-center justify-center gap-3 bg-background p-6">
        <Text className="text-xl font-semibold text-foreground">
          Página não encontrada
        </Text>
        <Link href="/" className="text-primary underline">
          Voltar ao início
        </Link>
      </View>
    </>
  );
}
