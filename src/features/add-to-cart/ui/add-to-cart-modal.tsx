import type { Product } from "@/shared/api/types";
import { useIsDesktop } from "@/shared/hooks/use-is-desktop";
import { Modal, Pressable, View } from "react-native";
import { AddToCartDialogContent } from "./add-to-cart-dialog-content";

interface AddToCartModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToCartModal({
  product,
  open,
  onOpenChange,
}: AddToCartModalProps) {
  const isDesktop = useIsDesktop() === true;
  const close = () => onOpenChange(false);

  return (
    <Modal
      visible={open && !!product}
      transparent={isDesktop}
      animationType={isDesktop ? "fade" : "slide"}
      presentationStyle={isDesktop ? undefined : "pageSheet"}
      onRequestClose={close} // Esc no web
    >
      {product &&
        (isDesktop ? (
          <View className="flex-1 items-center justify-center p-6">
            {/* Backdrop: clicar fora fecha */}
            <Pressable
              accessibilityLabel="Fechar"
              onPress={close}
              className="absolute inset-0 bg-black/50"
            />

            <View
              className="w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-xl"
              style={{ maxHeight: "90%" }}
            >
              <AddToCartDialogContent
                key={product.id}
                product={product}
                onOpenChange={onOpenChange}
                variant="dialog"
              />
            </View>
          </View>
        ) : (
          <AddToCartDialogContent
            key={product.id}
            product={product}
            onOpenChange={onOpenChange}
            variant="sheet"
          />
        ))}
    </Modal>
  );
}
