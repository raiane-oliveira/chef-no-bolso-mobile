import type { ComponentType } from "react";
import { Pressable } from "react-native";
import type { IconProps } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { AppText } from "./app-text";

interface NavLinkProps {
  to: string;
  label: string;
  icon: ComponentType<IconProps>;
  active?: boolean;
  variant?: "default" | "active" | "link";
  size?: "default" | "sm";
  className?: string;
}

export function NavLink({
  to,
  label,
  icon: Icon,
  active = false,
  variant = "default",
  size = "sm",
}: NavLinkProps) {
  const router = useRouter();

  const isActive = active || variant === "active";

  return (
    <Pressable
      onPress={() => router.push(to as never)}
      accessibilityRole="link"
      accessibilityState={{ selected: isActive }}
      className={[
        "flex-col items-center justify-center gap-1 rounded-md px-2 py-1",
        size === "sm" ? "w-20" : "min-w-20",
        variant === "default" && "border border-transparent",
        variant === "active" && "border border-musgo bg-musgo",
        variant === "link" && "flex-row p-0",
        isActive && variant === "default" && "border-lagoon-deep",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon
        size={size === "sm" ? 20 : 24}
        weight={isActive ? "fill" : "bold"}
        color={variant === "active" ? "#f0ebe3" : "#8c3e22"}
      />

      <AppText
        weight="medium"
        className={[
          "text-center",
          size === "sm" ? "text-xs" : "text-sm",
          variant === "active" ? "text-sand" : "text-lagoon-deep",
        ].join(" ")}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
