import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/shared/lib/utils";

type ScreenProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  safeTop?: boolean;
};

export function Screen({
  children,
  containerClassName,
  className,
  safeTop = true,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn("flex-1 bg-base", containerClassName)}
      style={{ paddingTop: safeTop ? insets.top : 0 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={cn("gap-4 p-4 pb-10", className)}
      >
        {children}
      </ScrollView>
    </View>
  );
}
