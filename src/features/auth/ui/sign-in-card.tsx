import { API_URL } from "@/shared/config/env";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, TextInputInstance, View } from "react-native";
import { useAuthContext } from "../model/authentication-context";
import { AppText } from "@/shared/ui/app-text";

export function SignInCard() {
  const { handleLogin } = useAuthContext();
  const router = useRouter();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    console.log("[LOGIN] 1 - Iniciando");

    if (isPending) return;

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Informe seu email e sua senha.");
      return;
    }

    setIsPending(true);

    try {
      console.log("[LOGIN] 2 - Antes do fetch");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      console.log("[LOGIN] 3 - Resposta recebida");

      const data = await response.json();

      console.log("[LOGIN] 4 - JSON recebido");

      if (!response.ok) {
        console.log("[LOGIN] 5 - Resposta HTTP com erro");
        setError(data?.message || "Email ou senha inválidos.");
        return;
      }

      console.log("[LOGIN] 6 - Antes do handleLogin");

      await handleLogin({
        accessToken: data.token,
        role: data.user.role,
      });

      console.log("[LOGIN] 7 - Antes do router.replace");

      router.replace("/");
    } catch (err) {
      console.error("[LOGIN] ERRO:", err);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      console.log("[LOGIN] 8 - Finalizando");
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-md">
      <CardHeader>
        <CardTitle>Entre na sua conta</CardTitle>
        <CardDescription>
          Identifique-se para ter acesso aos seus pedidos
        </CardDescription>
      </CardHeader>

      <CardContent>
        <View className="gap-6">
          <View className="gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@exemplo.com"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center">
              <Label>Senha</Label>
              <Pressable accessibilityRole="link" className="ml-auto">
                <AppText className="text-sm text-foreground underline">
                  Esqueceu sua senha?
                </AppText>
              </Pressable>
            </View>
            <Input
              ref={passwordRef}
              type="password"
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {error ? (
            <AppText className="text-sm text-destructive">{error}</AppText>
          ) : null}
        </View>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button
          disabled={isPending}
          onPress={handleSubmit}
          className={cn("w-full", isPending && "animate-pulse")}
          textClassName="uppercase"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </Button>

        <Link href="/auth/register" asChild>
          <Button
            variant="link"
            className="w-full"
            textClassName="no-underline"
          >
            Ainda não tem uma conta? Cadastre-se
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
