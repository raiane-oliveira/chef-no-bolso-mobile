import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  View,
  type PressableProps,
} from "react-native";
import { priceFormatter } from "@/shared/lib/formatters";
import type { Product } from "@/shared/api/types";
import { AddToCartDialogContent } from "@/features/add-to-cart/ui/add-to-cart-dialog-content";
import { AppText } from "@/shared/ui/app-text";

interface ProductCardProps extends Omit<PressableProps, "style"> {
  product: Product;
  orientation?: "vertical" | "horizontal";
  style?: PressableProps["style"];
}

export function ProductCard({
  product,
  style,
  orientation = "vertical",
  ...props
}: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const priceFormatted = priceFormatter.format(product.price);

  const dialog = (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <AddToCartDialogContent
        open={open}
        product={product}
        onOpenChange={setOpen}
      />
    </Modal>
  );

  if (orientation === "horizontal") {
    return (
      <>
        <Pressable
          {...props}
          accessibilityRole="button"
          accessibilityLabel={product.name}
          onPress={() => setOpen(true)}
          className="flex-row items-start gap-3 overflow-hidden rounded-md border border-line bg-card px-3 py-4"
          style={(state) =>
            typeof style === "function" ? style(state) : style
          }
        >
          {({ pressed }) => (
            <>
              <View className="flex-1 gap-3">
                <View className="flex-1 gap-1 px-1.5">
                  <AppText
                    numberOfLines={1}
                    className="text-base text-card-foreground"
                    weight="medium"
                  >
                    {product.name}
                  </AppText>

                  <AppText
                    numberOfLines={3}
                    className="text-sm text-muted-foreground"
                    weight="light"
                  >
                    {product.description}
                  </AppText>
                </View>

                <View className="px-1.5">
                  <AppText className="text-base text-card-foreground">
                    {priceFormatted}
                  </AppText>
                </View>
              </View>

              <View className="w-32 self-stretch overflow-hidden rounded-sm">
                <Image
                  source={{ uri: product.imageUrl }}
                  accessibilityElementsHidden
                  className="h-full w-full"
                  resizeMode="cover"
                  style={pressed ? { transform: [{ scale: 1.05 }] } : undefined}
                />
                {!pressed && (
                  <View
                    className="absolute inset-0"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                  />
                )}
              </View>
            </>
          )}
        </Pressable>

        {dialog}
      </>
    );
  }

  return (
    <>
      <Pressable
        {...props}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        onPress={() => setOpen(true)}
        className="gap-3 overflow-hidden rounded-md border border-line bg-card p-1"
        style={(state) => [
          {
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          },
          typeof style === "function" ? style(state) : style,
        ]}
      >
        {({ pressed }) => (
          <>
            <View className="aspect-[1.25] w-full overflow-hidden rounded-md">
              <Image
                source={{ uri: product.imageUrl }}
                accessibilityElementsHidden
                className="h-full w-full"
                resizeMode="cover"
                style={pressed ? { transform: [{ scale: 1.05 }] } : undefined}
              />
              {!pressed && (
                <View
                  className="absolute inset-0"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                />
              )}
            </View>

            <View className="flex-1 gap-1 px-1.5">
              <AppText
                numberOfLines={1}
                className="text-base text-card-foreground"
                weight="medium"
              >
                {product.name}
              </AppText>

              <AppText
                numberOfLines={2}
                className="text-sm text-muted-foreground"
                weight="light"
              >
                {product.description}
              </AppText>
            </View>

            <View className="p-1.5">
              <AppText className="text-base text-card-foreground">
                {priceFormatted}
              </AppText>
            </View>
          </>
        )}
      </Pressable>

      {dialog}
    </>
  );
}
