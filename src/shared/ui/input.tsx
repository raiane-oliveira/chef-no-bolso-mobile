import { cn } from "@/shared/lib/utils";
import type { ComponentProps } from "react";
import { TextInput } from "react-native";

type InputType = "text" | "email" | "password" | "number" | "tel" | "url";

type InputProps = ComponentProps<typeof TextInput> & {
  className?: string;
  type?: InputType;
  disabled?: boolean;
  invalid?: boolean;
};

const typeProps: Record<InputType, ComponentProps<typeof TextInput>> = {
  text: {},
  email: {
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoCorrect: false,
    autoComplete: "email",
    textContentType: "emailAddress",
  },
  password: {
    secureTextEntry: true,
    autoCapitalize: "none",
    autoCorrect: false,
    autoComplete: "password",
    textContentType: "password",
  },
  number: { keyboardType: "decimal-pad" },
  tel: {
    keyboardType: "phone-pad",
    autoComplete: "tel",
    textContentType: "telephoneNumber",
  },
  url: { keyboardType: "url", autoCapitalize: "none", autoCorrect: false },
};

function Input({
  className,
  type = "text",
  disabled,
  invalid,
  editable,
  ...props
}: InputProps) {
  return (
    <TextInput
      placeholderTextColor="#71717a"
      textAlignVertical="center"
      editable={disabled ? false : editable}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground",
        invalid && "border-destructive",
        disabled && "opacity-50",
        className,
      )}
      {...typeProps[type]}
      {...props}
    />
  );
}

export { Input };
