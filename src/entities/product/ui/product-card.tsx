import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from "react-native";
import { priceFormatter } from "@/shared/lib/formatters";
import type { Product } from "@/shared/api/types";
import { AddToCartDialogContent } from "@/features/add-to-cart/ui/add-to-cart-dialog-content";

const colors = {
  card: "#171717",
  border: "#262626",
  foreground: "#fafafa",
  muted: "#a3a3a3",
};

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
          style={(state) => [
            styles.card,
            styles.cardHorizontal,
            typeof style === "function" ? style(state) : style,
          ]}
        >
          {({ pressed }) => (
            <>
              <View style={styles.horizontalInfo}>
                <View style={styles.header}>
                  <Text numberOfLines={1} style={styles.title}>
                    {product.name}
                  </Text>
                  <Text numberOfLines={3} style={styles.description}>
                    {product.description}
                  </Text>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.price}>{priceFormatted}</Text>
                </View>
              </View>

              <View style={styles.horizontalImageWrapper}>
                <Image
                  source={{ uri: product.imageUrl }}
                  accessibilityElementsHidden
                  style={[styles.image, pressed && styles.imagePressed]}
                />
                {!pressed && <View style={styles.imageOverlay} />}
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
        style={(state) => [
          styles.card,
          styles.cardVertical,
          typeof style === "function" ? style(state) : style,
        ]}
      >
        {({ pressed }) => (
          <>
            <View style={styles.verticalImageWrapper}>
              <Image
                source={{ uri: product.imageUrl }}
                accessibilityElementsHidden
                style={[styles.image, pressed && styles.imagePressed]}
              />
              {!pressed && <View style={styles.imageOverlay} />}
            </View>

            <View style={styles.header}>
              <Text numberOfLines={1} style={styles.title}>
                {product.name}
              </Text>
              <Text numberOfLines={2} style={styles.description}>
                {product.description}
              </Text>
            </View>

            <View style={styles.footerPadded}>
              <Text style={styles.price}>{priceFormatted}</Text>
            </View>
          </>
        )}
      </Pressable>

      {dialog}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardVertical: {
    padding: 4,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHorizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  horizontalInfo: {
    flex: 1,
    gap: 12,
  },
  horizontalImageWrapper: {
    maxWidth: 128,
    width: 128,
    alignSelf: "stretch",
    borderRadius: 4,
    overflow: "hidden",
  },
  verticalImageWrapper: {
    width: "100%",
    aspectRatio: 1 / 0.8,
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePressed: {
    transform: [{ scale: 1.05 }],
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    flex: 1,
    paddingHorizontal: 6,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.foreground,
  },
  description: {
    fontSize: 14,
    fontWeight: "300",
    color: colors.muted,
  },
  footer: {
    paddingHorizontal: 6,
  },
  footerPadded: {
    padding: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.foreground,
  },
});
