import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { Label } from "@/shared/ui/label";
import { AppText } from "./app-text";

function toISODate(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function toDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

type DateFieldProps = {
  label: string;
  value: string; // 'YYYY-MM-DD' ou ''
  onChange: (value: string) => void;
};

// Substitui <Input type="date" />
export function DateField({ label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value + "T00:00:00") : new Date();

  return (
    <View className="flex-1 gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        className="h-10 justify-center rounded-md border border-input bg-card px-3"
      >
        <AppText
          className={value ? "text-foreground" : "text-muted-foreground"}
        >
          {value ? toDisplay(value) : "Selecionar"}
        </AppText>
      </Pressable>

      {open && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(event, selected) => {
            if (Platform.OS === "android") setOpen(false);
            if (event.type === "set" && selected) onChange(toISODate(selected));
          }}
        />
      )}
    </View>
  );
}
