import { cn } from "@/shared/lib/utils";
import type { ComponentProps } from "react";
import { Text } from "react-native";

type LabelProps = ComponentProps<typeof Text> & {
  className?: string;
};

function Label({ className, ...props }: LabelProps) {
  return (
    <Text
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
