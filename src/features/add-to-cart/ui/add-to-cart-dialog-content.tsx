import type { Product } from "@/shared/api/types";
import { priceFormatter } from "@/shared/lib/formatters";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useShoppingCartContext } from "../model/shopping-cart-context";
import { InputUpdateOrderCartAmount } from "./input-update-order-cart-amount";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

const MAX_OBSERVATION_LENGTH = 140;

interface AddToCartDialogContentProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToCartDialogContent({
  product,
  open,
  onOpenChange,
}: AddToCartDialogContentProps) {
  return (
    <Modal
      visible={open}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => onOpenChange(false)}
    >
      <AddToCartForm product={product} onOpenChange={onOpenChange} />
    </Modal>
  );
}

function AddToCartForm({
  product,
  onOpenChange,
}: Omit<AddToCartDialogContentProps, "open">) {
  const { addToCart, orders } = useShoppingCartContext();
  const orderInCart = orders.find((o) => o.id === product.id);

  const [observation, setObservation] = useState(
    orderInCart?.observation ?? "",
  );
  const [amount, setAmount] = useState(orderInCart?.amountInShoppingCart ?? 1);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      imgUrl: product.imageUrl,
      description: product.description,
      price: product.price,
      observation,
      amountInShoppingCart: amount,
    });

    onOpenChange(false);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-muted"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Image
            source={{ uri: product.imageUrl }}
            contentFit="cover"
            style={{ width: "100%", height: 288 }}
            accessibilityLabel={product.name}
          />
          <Pressable
            onPress={() => onOpenChange(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={8}
            className="absolute right-4 top-4 rounded-full bg-card p-1"
          >
            <X size={20} color="#18181b" />
          </Pressable>
        </View>

        <View className="-mt-8 flex-1 rounded-t-2xl bg-card p-4">
          <Text className="text-lg font-semibold text-foreground">
            {product.name}
          </Text>
          <Text className="mb-6 mt-3 text-sm text-muted-foreground">
            {product.description}
          </Text>

          <Text className="mb-4 text-base text-foreground">
            {priceFormatter.format(product.price)}
          </Text>

          <View className="mt-auto gap-2">
            <View className="flex-row items-center justify-between gap-2">
              <Label>Alguma observação?</Label>
              <Text className="text-sm text-muted-foreground">
                {observation.length} / {MAX_OBSERVATION_LENGTH}
              </Text>
            </View>
            <TextInput
              multiline
              maxLength={MAX_OBSERVATION_LENGTH}
              value={observation}
              onChangeText={setObservation}
              textAlignVertical="top"
              accessibilityLabel="Alguma observação?"
              className="min-h-24 rounded-md border border-input bg-card p-3 text-base text-foreground"
            />
          </View>
        </View>
      </ScrollView>

      <View
        className={`flex-row items-center justify-between gap-3 border-t border-muted bg-card px-4 pt-4 ${
          Platform.OS === "ios" ? "pb-8" : "pb-4"
        }`}
      >
        <InputUpdateOrderCartAmount amount={amount} setAmount={setAmount} />
        <Button
          className="h-12 flex-1 justify-between rounded-sm px-4"
          onPress={handleAddToCart}
        >
          {orderInCart ? "Atualizar" : "Adicionar"}
          <Text className="text-sm font-medium text-primary-foreground">
            {priceFormatter.format(product.price * amount)}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
