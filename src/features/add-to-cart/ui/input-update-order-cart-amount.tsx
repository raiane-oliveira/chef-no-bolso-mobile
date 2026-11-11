import { cn } from "@/shared/lib/utils";
import { Minus, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View, type ViewProps } from "react-native";

interface InputUpdateOrderCartAmountProps extends ViewProps {
  amount: number;
  setAmount: (value: number) => void;
  className?: string;
  compact?: boolean;
}

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

export function InputUpdateOrderCartAmount({
  amount,
  setAmount,
  compact = false,
  className,
  ...props
}: InputUpdateOrderCartAmountProps) {
  const [text, setText] = useState(String(amount));

  useEffect(() => {
    setText(String(amount));
  }, [amount]);

  function handleChangeText(value: string) {
    const digits = value.replace(/\D/g, "");
    setText(digits);

    const parsed = Number(digits);
    if (digits && parsed >= MIN_AMOUNT && parsed <= MAX_AMOUNT) {
      setAmount(parsed);
    }
  }

  const iconSize = compact ? 12 : 14;
  const decreaseDisabled = amount <= MIN_AMOUNT;

  return (
    <View
      {...props}
      className={cn(
        "w-full max-w-28 flex-row items-center justify-between rounded-sm bg-muted",
        compact && "max-w-24",
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
        disabled={decreaseDisabled}
        onPress={() => setAmount(amount - 1)}
        className={cn(
          "px-3 py-2",
          compact && "px-2",
          decreaseDisabled && "opacity-50",
        )}
      >
        <Minus size={iconSize} color="#18181b" />
      </Pressable>

      <TextInput
        accessibilityLabel="Quantidade de produtos"
        value={text}
        onChangeText={handleChangeText}
        onBlur={() => setText(String(amount))}
        keyboardType="number-pad"
        maxLength={5}
        selectTextOnFocus
        className={cn(
          "min-w-8 flex-1 p-0 text-center text-sm text-foreground",
          compact && "text-xs",
        )}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
        onPress={() => setAmount(Math.min(amount + 1, MAX_AMOUNT))}
        className={cn("px-3 py-2", compact && "px-2")}
      >
        <Plus size={iconSize} color="#18181b" />
      </Pressable>
    </View>
  );
}
