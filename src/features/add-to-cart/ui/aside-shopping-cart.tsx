import { priceFormatter } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";
import { Sheet } from "@/shared/ui/sheet";
import { Image } from "expo-image";
import {
  BadgePercent,
  Bike,
  ChevronRight,
  Footprints,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View, type ViewProps } from "react-native";
import {
  useShoppingCartContext,
  type DeliveryType,
} from "../model/shopping-cart-context";
import { InputUpdateOrderCartAmount } from "./input-update-order-cart-amount";
import { Button } from "@/shared/ui/button";
import { AppText } from "@/shared/ui/app-text";
import { AddToCartModal } from "./add-to-cart-modal";

export interface AsideShoppingCartProps extends ViewProps {
  className?: string;
}

interface DeliveryOptionConfig {
  icon: LucideIcon;
  label: string;
  hint: string;
  selectedLabel: string;
  selectedHint: string;
}

const DELIVERY_FEE = 7;
const MUTED_ICON_COLOR = "#71717a";

const deliveryOptions: Record<DeliveryType, DeliveryOptionConfig> = {
  entrega: {
    icon: Bike,
    label: "Entrega",
    hint: "A gente leva até você",
    selectedLabel: "Rua das Lavouras, 123, Limoeiro, Campina Grande - PB",
    selectedHint: "Entrega em 23 min / R$ 7,00",
  },
  retirada: {
    icon: Footprints,
    label: "Retirada",
    hint: "Você retira no local",
    selectedLabel: "Retirar no local",
    selectedHint: "R. Odon Bezerra, 300 - Liberdade",
  },
  "consumo-no-local": {
    icon: Store,
    label: "Consumo no local",
    hint: "Você consome no local",
    selectedLabel: "Consumir no local",
    selectedHint: "R. Odon Bezerra, 300 - Liberdade",
  },
};

const deliveryTypes = Object.keys(deliveryOptions) as DeliveryType[];

function Divider() {
  return <View className="w-full border-t border-dashed border-border" />;
}

export function AsideShoppingCart({
  className,
  ...props
}: AsideShoppingCartProps) {
  const {
    orders,
    delivery,
    totalValue: subtotal,
    clearCart,
    updateAmountInCart,
    updateDeliveryOption,
  } = useShoppingCartContext();

  const [isDeliverySheetOpen, setIsDeliverySheetOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const deliveryType = delivery?.type;
  const selectedDelivery = deliveryType ? deliveryOptions[deliveryType] : null;

  const isEmpty = orders.length === 0;
  const taxDelivery = deliveryType === "entrega" ? DELIVERY_FEE : 0;
  const total = subtotal + taxDelivery;

  function handleSelectDelivery(type: DeliveryType) {
    updateDeliveryOption({
      type,
      price: type === "entrega" ? DELIVERY_FEE : 0,
    });
    setIsDeliverySheetOpen(false);
  }
  const editingOrder = orders.find((o) => o.id === editingOrderId) ?? null;

  return (
    <View
      {...props}
      className={cn(
        "flex-1 border border-border overflow-hidden rounded-md",
        className,
      )}
    >
      <Pressable
        onPress={() => setIsDeliverySheetOpen(true)}
        accessibilityRole="button"
        className="flex-row items-center justify-between gap-2 bg-card px-3 py-4"
      >
        {selectedDelivery ? (
          <View className="flex-1 flex-row items-center gap-3">
            <selectedDelivery.icon size={24} color={MUTED_ICON_COLOR} />
            <View className="flex-1">
              <AppText weight="medium" className="text-[13px] text-foreground">
                {selectedDelivery.selectedLabel}
              </AppText>
              <AppText weight="light" className="text-xs text-muted-foreground">
                {selectedDelivery.selectedHint}
              </AppText>
            </View>
          </View>
        ) : (
          <AppText
            weight="medium"
            className="flex-1 text-[13px] text-muted-foreground"
          >
            Calcular taxa e tempo de entrega
          </AppText>
        )}
        <ChevronRight size={16} color={MUTED_ICON_COLOR} />
      </Pressable>

      <Divider />

      <ScrollView className="flex-1 bg-base" contentContainerClassName="grow">
        {isEmpty ? (
          <View className="flex-1 items-center justify-center py-8">
            <ShoppingBag size={64} color={MUTED_ICON_COLOR} />
            <AppText className="mt-2 text-lg text-muted-foreground">
              Sacola vazia
            </AppText>
          </View>
        ) : (
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <AppText weight="medium" className="text-foreground">
                Sua sacola
              </AppText>
              <Pressable onPress={() => clearCart()} hitSlop={8}>
                <AppText
                  weight="medium"
                  className="text-xs uppercase text-foreground"
                >
                  Limpar
                </AppText>
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {orders.map((order) => (
                <Pressable
                  key={order.id}
                  onPress={() => setEditingOrderId(order.id)}
                  className="flex-row justify-between gap-3 rounded-md bg-card p-3 hover:bg-card/80 active:opacity-90"
                >
                  <View className="flex-1 justify-between gap-2">
                    <View className="flex-row items-center gap-1.5">
                      <AppText
                        weight="semibold"
                        className="text-sm text-foreground"
                      >
                        {order.amountInShoppingCart}x
                      </AppText>
                      <AppText className="flex-1 text-sm text-foreground">
                        {order.name}
                      </AppText>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <InputUpdateOrderCartAmount
                        compact
                        amount={order.amountInShoppingCart}
                        setAmount={(newAmount) =>
                          updateAmountInCart(order.id, newAmount)
                        }
                      />
                      <Pressable
                        onPress={() => clearCart(order.id)}
                        hitSlop={8}
                        className="pl-2"
                      >
                        <AppText className="text-xs text-muted-foreground">
                          Remover
                        </AppText>
                      </Pressable>
                    </View>
                  </View>

                  <View className="items-end gap-2">
                    <AppText
                      weight="medium"
                      className="text-sm text-foreground"
                    >
                      {priceFormatter.format(
                        order.price * order.amountInShoppingCart,
                      )}
                    </AppText>
                    <Image
                      source={{ uri: order.imgUrl }}
                      contentFit="cover"
                      style={{ width: 56, height: 56, borderRadius: 4 }}
                      accessibilityLabel={order.name}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {!isEmpty && (
        <>
          <Divider />
          <View className="gap-1 bg-card px-4 py-2.5">
            <View className="flex-row items-center justify-between gap-1">
              <AppText
                weight="light"
                className="text-[13px] font-light text-muted-foreground"
              >
                Subtotal
              </AppText>
              <AppText
                weight="light"
                className="text-[13px] font-light text-muted-foreground"
              >
                {priceFormatter.format(subtotal)}
              </AppText>
            </View>
            <View className="flex-row items-center justify-between gap-1">
              <AppText
                weight="light"
                className="text-[13px] font-light text-muted-foreground"
              >
                Taxa de entrega
              </AppText>
              <AppText
                weight="light"
                className="text-[13px] font-light text-muted-foreground"
              >
                {priceFormatter.format(taxDelivery)}
              </AppText>
            </View>
            <View className="flex-row items-center justify-between gap-1">
              <AppText
                weight="medium"
                className="text-base font-medium text-foreground"
              >
                Total
              </AppText>
              <AppText
                weight="medium"
                className="text-base font-medium text-foreground"
              >
                {priceFormatter.format(total)}
              </AppText>
            </View>
          </View>
        </>
      )}

      <Divider />

      <Button
        variant="outline"
        className="h-auto w-full justify-between rounded-none border-0 px-4 py-3"
      >
        <View className="flex-1 flex-row items-center gap-3">
          <BadgePercent size={24} color={MUTED_ICON_COLOR} />
          <View>
            <AppText
              weight="bold"
              className="text-[13px] font-bold text-muted-foreground"
            >
              Que tal usar um cupom?
            </AppText>
            <AppText
              weight="light"
              className="text-[13px] font-light text-muted-foreground"
            >
              1 disponível
            </AppText>
          </View>
        </View>
        <ChevronRight size={16} color={MUTED_ICON_COLOR} />
      </Button>

      <Divider />

      <View className="w-full bg-card p-3">
        <Button disabled className="h-12 w-full" textClassName="text-base">
          Estabelecimento fechado
        </Button>
      </View>

      <AddToCartModal
        open={editingOrderId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingOrderId(null);
        }}
        product={
          editingOrder && {
            id: editingOrder.id,
            name: editingOrder.name,
            description: editingOrder.description,
            price: editingOrder.price,
            imageUrl: editingOrder.imgUrl,
          }
        }
      />

      <Sheet
        visible={isDeliverySheetOpen}
        onClose={() => setIsDeliverySheetOpen(false)}
        title="Como você quer receber o pedido?"
      >
        <View className="gap-2">
          {deliveryTypes.map((type) => {
            const option = deliveryOptions[type];
            const active = type === deliveryType;

            return (
              <Pressable
                key={type}
                onPress={() => handleSelectDelivery(type)}
                accessibilityRole="button"
                className={cn(
                  "flex-row items-center gap-3 rounded-md border p-3",
                  active ? "border-primary bg-muted" : "border-border bg-card",
                )}
              >
                <option.icon size={24} color={MUTED_ICON_COLOR} />
                <View className="flex-1">
                  <AppText className="text-sm text-foreground">
                    {option.label}
                  </AppText>
                  <AppText className="text-xs text-muted-foreground">
                    {option.hint}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </View>
  );
}
