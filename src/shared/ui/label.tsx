import { cn } from "@/shared/lib/utils";
import type { ComponentProps } from "react";
import { AppText } from "./app-text";

type LabelProps = ComponentProps<typeof AppText> & {
  className?: string;
};

function Label({ className, ...props }: LabelProps) {
  return (
    <AppText
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
