import { API_URL } from "@/shared/config/env";
import type { ChildrenProps, Role } from "@/shared/lib/shared-types";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  accessToken: string;
  role: Role;
  expiresAt?: Date | string;
}

interface AuthenticationContextProps {
  session: UserSession | null;
  isLoading: boolean;
  handleLogin: (session: UserSession) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const SESSION_KEY = "chefnobolso.session";

const AuthenticationContext = createContext<AuthenticationContextProps | null>(
  null,
);

export function AuthenticationContextProvider({ children }: ChildrenProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      let stored: UserSession | null = null;

      try {
        const raw = await SecureStore.getItemAsync(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as UserSession;
          if (!parsed.expiresAt || new Date(parsed.expiresAt) >= new Date()) {
            stored = parsed;
          } else {
            await SecureStore.deleteItemAsync(SESSION_KEY);
          }
        }
      } catch {
        await SecureStore.deleteItemAsync(SESSION_KEY).catch(() => {});
      }

      if (cancelled) return;
      setSession(stored);
      setIsLoading(false);

      if (!stored) return;

      // Valida o token em segundo plano
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${stored.accessToken}` },
        });

        if (res.status === 401 || res.status === 403) {
          await SecureStore.deleteItemAsync(SESSION_KEY);
          if (!cancelled) setSession(null);
        }
      } catch {
        // offline / servidor indisponível: mantém a sessão
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogin(loginSession: UserSession) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(loginSession));
    setSession(loginSession);
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    setSession(null);
  }

  return (
    <AuthenticationContext
      value={{ session, isLoading, handleLogin, handleLogout }}
    >
      {children}
    </AuthenticationContext>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthenticationContextProvider",
    );
  }

  return context;
};
