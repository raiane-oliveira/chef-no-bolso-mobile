import { cn } from "@/shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Children, type ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import { AppText, AppTextWeight } from "./app-text";

const buttonVariants = cva(
  "shrink-0 flex-row items-center justify-center gap-2 rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/90",
        destructive: "bg-destructive active:bg-destructive/90",
        outline: "border border-input bg-background active:bg-accent",
        secondary: "bg-secondary active:bg-secondary/80",
        ghost: "active:bg-accent",
        link: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 gap-1 px-2",
        sm: "h-8 gap-1.5 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-white",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      link: "text-primary underline",
    },
    size: {
      default: "",
      xs: "text-xs",
      sm: "",
      lg: "",
      icon: "",
      "icon-xs": "text-xs",
      "icon-sm": "",
      "icon-lg": "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = Omit<PressableProps, "children"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children?: ReactNode;
  };

function Button({
  className,
  textClassName = "font-medium",
  variant = "default",
  size = "default",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const fontWeight = textClassName
    .replace(/font-[\w-]+/g, "")
    .trim() as AppTextWeight;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {Children.map(children, (child) =>
        typeof child === "string" || typeof child === "number" ? (
          <AppText
            weight={fontWeight}
            className={cn(buttonTextVariants({ variant, size }), textClassName)}
          >
            {child}
          </AppText>
        ) : (
          child
        ),
      )}
    </Pressable>
  );
}

export { Button, buttonVariants, buttonTextVariants };
