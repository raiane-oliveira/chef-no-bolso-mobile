import { z } from "zod";

const schema = z.object({
  EXPO_PUBLIC_APP_TITLE: z.string().min(1).optional(),
  EXPO_PUBLIC_API_URL: z.url().optional(),
});

const parsed = schema.safeParse({
  EXPO_PUBLIC_APP_TITLE: process.env.EXPO_PUBLIC_APP_TITLE || undefined,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || undefined,
});

if (!parsed.success) {
  throw new Error(
    `Variáveis de ambiente inválidas: ${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;

export const API_URL = env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";
