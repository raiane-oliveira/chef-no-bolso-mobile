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
import { Pressable, Text, TextInputInstance, View } from "react-native";
import { useAuthContext } from "../model/authentication-context";

export function SignInCard() {
  const { handleLogin } = useAuthContext();
  const router = useRouter();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (isPending) return;
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Informe seu email e sua senha.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Email ou senha inválidos.");
        return;
      }

      await handleLogin({
        accessToken: data.token,
        role: data.user.role,
      });

      router.replace("/");
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
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
                <Text className="text-sm text-foreground underline">
                  Esqueceu sua senha?
                </Text>
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
            <Text className="text-sm text-destructive">{error}</Text>
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
          <Button variant="link" className="w-full" textClassName="font-normal">
            Ainda não tem uma conta? Cadastre-se
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
