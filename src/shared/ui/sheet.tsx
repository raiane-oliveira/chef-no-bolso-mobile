import { X } from 'lucide-react-native'
import type { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'

type SheetProps = {
  visible: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: ReactNode
  footer?: ReactNode
  /** false quando o conteúdo já tem scroll próprio */
  scroll?: boolean
  children: ReactNode
}

// Substitui Dialog/DialogContent/DialogHeader/DialogFooter do Radix
export function Sheet({
  visible,
  onClose,
  title,
  description,
  icon,
  footer,
  scroll = true,
  children,
}: SheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between border-b border-border bg-card p-4">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center gap-2">
              {icon}
              <Text className="text-xl font-semibold text-foreground">{title}</Text>
            </View>
            {description ? (
              <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
            ) : null}
          </View>
          <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Fechar">
            <X size={22} color="#18181b" />
          </Pressable>
        </View>

        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="gap-4 p-4"
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
        )}

        {footer ? (
          <View className="flex-row justify-end gap-2 border-t border-border bg-card p-4">
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  )
}
