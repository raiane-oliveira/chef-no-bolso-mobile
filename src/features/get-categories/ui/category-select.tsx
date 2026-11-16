import { Pressable, ScrollView } from "react-native";

import type { Category } from "@/shared/api/types";
import { AppText } from "@/shared/ui/app-text";

interface CategorySelectProps {
  categories: Category[];
  value: string | null;
  onChange: (id: string | null) => void;
  loading?: boolean;
}

interface CategoryBadgeProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

function CategoryBadge({
  label,
  selected,
  onPress,
  disabled,
}: CategoryBadgeProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      className={`h-9 items-center justify-center rounded-full border px-4 ${
        selected ? "border-primary bg-primary" : "border-input bg-card"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <AppText
        numberOfLines={1}
        className={selected ? "text-primary-foreground" : "text-foreground"}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export function CategorySelect({
  categories,
  value,
  onChange,
  loading,
}: CategorySelectProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
    >
      <CategoryBadge
        label="Todas"
        selected={value === null}
        onPress={() => onChange(null)}
        disabled={loading}
      />

      {categories.map((category) => (
        <CategoryBadge
          key={category.id}
          label={category.name}
          selected={value === category.id}
          onPress={() => onChange(category.id)}
          disabled={loading}
        />
      ))}
    </ScrollView>
  );
}
