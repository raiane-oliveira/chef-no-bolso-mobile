import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { X } from "lucide-react-native";

import { useIsDesktop } from "@/shared/hooks/use-is-desktop";
import { AppText } from "@/shared/ui/app-text";
import { Sheet } from "@/shared/ui/sheet";

interface ResponsiveDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function ResponsiveDialog({
  visible,
  onClose,
  title,
  icon,
  children,
}: ResponsiveDialogProps) {
  const isDesktop = useIsDesktop() === true;

  if (!isDesktop) {
    return (
      <Sheet visible={visible} onClose={onClose} title={title} icon={icon}>
        {children}
      </Sheet>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center p-6">
        {/* Backdrop: clicar fora fecha */}
        <Pressable
          accessibilityLabel="Fechar"
          onPress={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Caixa do dialog */}
        <View
          accessibilityRole="none"
          className="w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-xl"
          style={{ maxHeight: "85%" }}
        >
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <View className="flex-row items-center gap-2">
              {icon}
              <AppText weight="semibold" className="text-lg text-foreground">
                {title}
              </AppText>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityLabel="Fechar"
              className="rounded-md p-1 hover:bg-muted active:opacity-70"
            >
              <X size={20} color="#52525b" />
            </Pressable>
          </View>

          <View className="shrink">{children}</View>
        </View>
      </View>
    </Modal>
  );
}
