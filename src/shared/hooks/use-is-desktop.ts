import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export const DESKTOP_BREAKPOINT = 1024;

/**
 * Retorna `null` no servidor e no primeiro render do cliente,
 * para o HTML da hidratação ser idêntico nos dois lados.
 */
export function useIsDesktop(): boolean | null {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return width >= DESKTOP_BREAKPOINT;
}
