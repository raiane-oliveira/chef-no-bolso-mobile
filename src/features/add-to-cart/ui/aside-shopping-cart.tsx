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
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewProps,
} from "react-native";
import {
  useShoppingCartContext,
  type DeliveryType,
} from "../model/shopping-cart-context";
import { AddToCartDialogContent } from "./add-to-cart-dialog-content";
import { InputUpdateOrderCartAmount } from "./input-update-order-cart-amount";
import { Button } from "@/shared/ui/button";

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

  return (
    <View
      {...props}
      className={cn("flex-1 overflow-hidden rounded-md", className)}
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
              <Text className="text-[13px] font-medium text-foreground">
                {selectedDelivery.selectedLabel}
              </Text>
              <Text className="text-xs font-light text-muted-foreground">
                {selectedDelivery.selectedHint}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="flex-1 text-[13px] font-medium text-muted-foreground">
            Calcular taxa e tempo de entrega
          </Text>
        )}
        <ChevronRight size={16} color={MUTED_ICON_COLOR} />
      </Pressable>

      <Divider />

      <ScrollView className="flex-1" contentContainerClassName="grow">
        {isEmpty ? (
          <View className="flex-1 items-center justify-center py-8">
            <ShoppingBag size={64} color={MUTED_ICON_COLOR} />
            <Text className="mt-2 text-lg text-muted-foreground">
              Sacola vazia
            </Text>
          </View>
        ) : (
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-foreground">Sua sacola</Text>
              <Pressable onPress={() => clearCart()} hitSlop={8}>
                <Text className="text-xs font-medium uppercase text-foreground">
                  Limpar
                </Text>
              </Pressable>
            </View>

            <View className="mt-4 gap-3">
              {orders.map((order) => (
                <View key={order.id}>
                  <Pressable
                    onPress={() => setEditingOrderId(order.id)}
                    className="flex-row justify-between gap-3 rounded-md bg-card p-3 active:opacity-90"
                  >
                    <View className="flex-1 justify-between gap-2">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-sm font-semibold text-foreground">
                          {order.amountInShoppingCart}x
                        </Text>
                        <Text className="flex-1 text-sm text-foreground">
                          {order.name}
                        </Text>
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
                          <Text className="text-xs text-muted-foreground">
                            Remover
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    <View className="items-end gap-2">
                      <Text className="text-sm font-medium text-foreground">
                        {priceFormatter.format(
                          order.price * order.amountInShoppingCart,
                        )}
                      </Text>
                      <Image
                        source={{ uri: order.imgUrl }}
                        contentFit="cover"
                        style={{ width: 56, height: 56, borderRadius: 4 }}
                        accessibilityLabel={order.name}
                      />
                    </View>
                  </Pressable>

                  <AddToCartDialogContent
                    product={{
                      id: order.id,
                      name: order.name,
                      description: order.description,
                      price: order.price,
                      imageUrl: order.imgUrl,
                    }}
                    open={editingOrderId === order.id}
                    onOpenChange={(open) =>
                      setEditingOrderId(open ? order.id : null)
                    }
                  />
                </View>
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
              <Text className="text-[13px] font-light text-muted-foreground">
                Subtotal
              </Text>
              <Text className="text-[13px] font-light text-muted-foreground">
                {priceFormatter.format(subtotal)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between gap-1">
              <Text className="text-[13px] font-light text-muted-foreground">
                Taxa de entrega
              </Text>
              <Text className="text-[13px] font-light text-muted-foreground">
                {priceFormatter.format(taxDelivery)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between gap-1">
              <Text className="text-base font-medium text-foreground">
                Total
              </Text>
              <Text className="text-base font-medium text-foreground">
                {priceFormatter.format(total)}
              </Text>
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
            <Text className="text-[13px] font-bold text-muted-foreground">
              Que tal usar um cupom?
            </Text>
            <Text className="text-[13px] font-light text-muted-foreground">
              1 disponível
            </Text>
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
                  <Text className="text-sm text-foreground">
                    {option.label}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {option.hint}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </View>
  );
}
