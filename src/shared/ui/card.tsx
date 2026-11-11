import { cn } from "@/shared/lib/utils";
import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from "react";
import { View, type ViewProps } from "react-native";
import { AppText } from "./app-text";

export interface CardProps extends ViewProps {
  className?: string;
}

function hasClass(className: string | undefined, name: string) {
  return !!className && className.split(/\s+/).includes(name);
}

function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "flex-col gap-6 rounded-xl border border-border bg-card py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  children,
  ...props
}: CardProps & { children?: ReactNode }) {
  const items = Children.toArray(children);
  const action = items.find(
    (child) => isValidElement(child) && child.type === CardAction,
  );
  const content = items.filter((child) => child !== action);

  return (
    <View
      className={cn(
        "px-6",
        hasClass(className, "border-b") && "pb-6",
        className,
      )}
      {...props}
    >
      {action ? (
        <View className="flex-row items-start gap-2">
          <View className="flex-1 gap-2">{content}</View>
          {action}
        </View>
      ) : (
        <View className="gap-2">{content}</View>
      )}
    </View>
  );
}

function CardTitle({
  className,
  ...props
}: ComponentProps<typeof AppText> & { className?: string }) {
  return (
    <AppText
      weight="semibold"
      className={cn("leading-none text-card-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: ComponentProps<typeof AppText> & { className?: string }) {
  return (
    <AppText
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: CardProps) {
  return <View className={cn("self-start", className)} {...props} />;
}

function CardContent({ className, ...props }: CardProps) {
  return <View className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "flex-row items-center px-6",
        hasClass(className, "border-t") && "pt-6",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
