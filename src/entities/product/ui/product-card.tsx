import { useState } from "react";
import {
  Image,
  Pressable,
  View,
  type PressableProps,
  type PressableStateCallbackType,
} from "react-native";

import { AddToCartModal } from "@/features/add-to-cart/ui/add-to-cart-modal";
import type { Product } from "@/shared/api/types";
import { priceFormatter } from "@/shared/lib/formatters";
import { AppText } from "@/shared/ui/app-text";

interface ProductCardProps extends Omit<PressableProps, "style"> {
  product: Product;
  orientation?: "vertical" | "horizontal";
  style?: PressableProps["style"];
}

type CardState = PressableStateCallbackType & { hovered?: boolean };

export function ProductCard({
  product,
  style,
  orientation = "vertical",
  ...props
}: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const priceFormatted = priceFormatter.format(product.price);

  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === "function" ? style(state) : style;

  if (orientation === "horizontal") {
    return (
      <>
        <Pressable
          {...props}
          accessibilityRole="button"
          accessibilityLabel={product.name}
          onPress={() => setOpen(true)}
          className="max-h-44 flex-row items-start gap-3 overflow-hidden rounded-md border border-line bg-card px-3 py-4 hover:border-primary/30 md:max-h-48"
          style={resolveStyle}
        >
          {(state: CardState) => {
            const active = state.pressed || !!state.hovered;
            return (
              <>
                <View className="flex-1 gap-3 self-stretch">
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

                <View className="w-32 self-stretch overflow-hidden rounded-sm md:w-40">
                  <Image
                    source={{ uri: product.imageUrl }}
                    accessibilityElementsHidden
                    className="h-full w-full"
                    resizeMode="cover"
                    style={
                      active ? { transform: [{ scale: 1.05 }] } : undefined
                    }
                  />
                  {!active && (
                    <View
                      className="absolute inset-0"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    />
                  )}
                </View>
              </>
            );
          }}
        </Pressable>

        <AddToCartModal product={product} open={open} onOpenChange={setOpen} />
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
        className="gap-3 overflow-hidden rounded-md border border-line bg-card p-1 hover:border-primary"
        style={(state) => [
          {
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          },
          resolveStyle(state),
        ]}
      >
        {(state: CardState) => {
          const active = state.pressed || !!state.hovered;
          return (
            <>
              <View className="aspect-[1.25] w-full overflow-hidden rounded-md">
                <Image
                  source={{ uri: product.imageUrl }}
                  accessibilityElementsHidden
                  className="h-full w-full"
                  resizeMode="cover"
                  style={active ? { transform: [{ scale: 1.05 }] } : undefined}
                />
                {!active && (
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
          );
        }}
      </Pressable>

      <AddToCartModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}
