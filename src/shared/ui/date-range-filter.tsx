import { View } from "react-native";
import { Button } from "@/shared/ui/button";
import { DateField } from "@/shared/ui/date-field";

type Props = {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onClear: () => void;
};

export function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClear,
}: Props) {
  return (
    <View className="flex-row items-end gap-3">
      <DateField
        label="Data inicial"
        value={startDate}
        onChange={onStartChange}
      />
      <DateField label="Data final" value={endDate} onChange={onEndChange} />
      {(startDate || endDate) && (
        <Button variant="outline" size="sm" onPress={onClear}>
          Limpar
        </Button>
      )}
    </View>
  );
}
