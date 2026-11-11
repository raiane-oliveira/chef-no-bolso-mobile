import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignInCard } from "@/features/auth/ui/sign-in-card";
import { AppText } from "@/shared/ui/app-text";
import { Screen } from "@/shared/ui/screen";
import { Redirect } from "expo-router";

export default function LoginScreen() {
  const { session } = useAuthContext();

  if (session) return <Redirect href="/" />;

  return (
    <Screen safeTop={false} className="items-center h-full">
      <AppText weight="semibold" className="text-2xl text-foreground">
        Login
      </AppText>
      <SignInCard />
    </Screen>
  );
}
