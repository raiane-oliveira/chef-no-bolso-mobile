import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignInCard } from "@/features/auth/ui/sign-in-card";
import { Screen } from "@/shared/ui/screen";
import type { ReactNode } from "react";
import { Text } from "react-native";

type Props = {
  role: string; // 'ADMIN' | 'DELIVERY'
  title: string;
  safeTop?: boolean;
  children: ReactNode;
};

export function RoleGate({ role, title, safeTop = false, children }: Props) {
  const { session } = useAuthContext();

  if (!session) {
    return (
      <Screen safeTop={safeTop} className="items-center">
        <Text className="text-2xl font-semibold text-foreground">{title}</Text>
        <SignInCard />
      </Screen>
    );
  }

  if (session.role !== role) {
    return (
      <Screen safeTop={safeTop} className="items-center">
        <Text className="text-2xl font-semibold text-foreground">
          Acesso negado
        </Text>
        <Text className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </Text>
      </Screen>
    );
  }

  return <>{children}</>;
}
