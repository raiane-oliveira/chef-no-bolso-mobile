import { API_URL } from "@/shared/config/env";
import { cn } from "@/shared/lib/utils";
import { AppText } from "@/shared/ui/app-text";
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
import { TextInputInstance, View } from "react-native";

export function SignUpCard() {
  const router = useRouter();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const passwordConfirmationRef = useRef<TextInputInstance>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    if (isPending) return;
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !passwordConfirmation) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Não foi possível criar sua conta.");
        return;
      }

      router.replace("/auth/login");
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-md">
      <CardHeader>
        <CardTitle>Cadastre-se</CardTitle>
        <CardDescription>
          Crie sua conta para acompanhar seus pedidos e aproveitar ofertas
          exclusivas
        </CardDescription>
      </CardHeader>

      <CardContent>
        <View className="gap-6">
          <View className="gap-2">
            <Label>Nome</Label>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>

          <View className="gap-2">
            <Label>Email</Label>
            <Input
              ref={emailRef}
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@exemplo.com"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View className="gap-2">
            <Label>Senha</Label>
            <Input
              ref={passwordRef}
              type="password"
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
              onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
            />
          </View>

          <View className="gap-2">
            <Label>Repita senha</Label>
            <Input
              ref={passwordConfirmationRef}
              type="password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
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
          onPress={handleSignUp}
          className={cn("w-full", isPending && "animate-pulse")}
          textClassName="uppercase"
        >
          {isPending ? "Enviando..." : "Enviar"}
        </Button>

        <Link href="/auth/login" asChild>
          <Button
            variant="link"
            className="w-full"
            textClassName="no-underline"
          >
            Já possui uma conta? Faça login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
