import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignInCard } from "@/features/auth/ui/sign-in-card";
import { Screen } from "@/shared/ui/screen";
import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function LoginScreen() {
  const { session } = useAuthContext();

  if (session) return <Redirect href="/" />;

  return (
    <Screen safeTop={false} className="items-center">
      <Text className="text-2xl font-semibold text-foreground">Login</Text>
      <SignInCard />
    </Screen>
  );
}
