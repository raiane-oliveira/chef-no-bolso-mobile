import { createContext, useContext, useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View, type ViewStyle } from "react-native";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null,
);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(
      "DropdownMenu components must be used inside DropdownMenu.",
    );
  }

  return context;
}

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenu();

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      {children}
    </Pressable>
  );
}

interface DropdownMenuContentProps {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}

function DropdownMenuContent({
  children,
  align = "end",
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenu();

  const alignment: ViewStyle =
    align === "start"
      ? { alignSelf: "flex-start" }
      : align === "center"
        ? { alignSelf: "center" }
        : { alignSelf: "flex-end" };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1 justify-end bg-black/20 px-3 pb-24"
        onPress={() => setOpen(false)}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={alignment}
          className="w-52 overflow-hidden rounded-lg border border-line bg-white p-1 shadow-lg"
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

function DropdownMenuItem({
  children,
  onPress,
  destructive = false,
  disabled = false,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        onPress?.();
        setOpen(false);
      }}
      className={[
        "flex-row items-center gap-2 rounded-md px-3 py-2.5",
        disabled ? "opacity-50" : "active:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </Pressable>
  );
}

function DropdownMenuSeparator() {
  return <View className="my-1 h-px bg-gray-200" />;
}

interface DropdownMenuLabelProps {
  children: ReactNode;
}

function DropdownMenuLabel({ children }: DropdownMenuLabelProps) {
  return (
    <Text className="px-3 py-2 text-sm font-semibold text-gray-700">
      {children}
    </Text>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
