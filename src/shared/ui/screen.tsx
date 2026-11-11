import type { ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '@/shared/lib/utils'

type ScreenProps = {
  children: ReactNode
  className?: string
  /** false quando a tela já tem header nativo (Stack) */
  safeTop?: boolean
}

// Substitui <main className="page-wrap ..."> + <section>
export function Screen({ children, className, safeTop = true }: ScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: safeTop ? insets.top : 0 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={cn('gap-4 p-4 pb-10', className)}
      >
        {children}
      </ScrollView>
    </View>
  )
}
