import { Text, type TextProps } from "react-native";

export type AppTextWeight =
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold";

interface AppTextProps extends TextProps {
  weight?: AppTextWeight;
  className?: string;
}

const fontWeights = {
  light: "font-rubik-light",
  regular: "font-sans",
  medium: "font-rubik-medium",
  semibold: "font-rubik-semibold",
  bold: "font-rubik-bold",
};

export function AppText({
  weight = "regular",
  className,
  ...props
}: AppTextProps) {
  return (
    <Text {...props} className={`${fontWeights[weight]} ${className ?? ""}`} />
  );
}
