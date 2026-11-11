import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignUpCard } from "@/features/auth/ui/sign-up-card";
import { Screen } from "@/shared/ui/screen";
import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function RegisterScreen() {
  const { session } = useAuthContext();

  if (session) return <Redirect href="/" />;

  return (
    <Screen safeTop={false} className="items-center">
      <Text className="text-2xl font-semibold text-foreground">Cadastrar</Text>
      <SignUpCard />
    </Screen>
  );
}
