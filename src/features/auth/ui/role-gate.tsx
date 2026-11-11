import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignInCard } from "@/features/auth/ui/sign-in-card";
import { AppText } from "@/shared/ui/app-text";
import { Screen } from "@/shared/ui/screen";
import type { ReactNode } from "react";

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
        <AppText weight="semibold" className="text-2xl text-foreground">
          {title}
        </AppText>
        <SignInCard />
      </Screen>
    );
  }

  if (session.role !== role) {
    return (
      <Screen safeTop={safeTop} className="items-center">
        <AppText weight="semibold" className="text-2xl text-foreground">
          Acesso negado
        </AppText>
        <AppText className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </AppText>
      </Screen>
    );
  }

  return <>{children}</>;
}
