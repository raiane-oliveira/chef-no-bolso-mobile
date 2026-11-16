import { Image } from "expo-image";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { priceFormatter } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  deliveryTypeLabels,
  statusColors,
  statusLabels,
  type Order,
} from "../model/types";
import { AppText } from "@/shared/ui/app-text";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  /** mostra nome/email do cliente (admin ou entregador) */
  showUser?: boolean;
  /** botões extras, ex.: "Finalizar" */
  actions?: ReactNode;
};

export function OrderCard({
  order,
  expanded,
  onToggle,
  showUser,
  actions,
}: Props) {
  const status = statusColors[order.status];
  const itemsLabel = `${order.items.length} ${order.items.length === 1 ? "item" : "itens"}`;

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <CardTitle>Pedido #{order.id.slice(-6).toUpperCase()}</CardTitle>
              <View className={cn("rounded-full px-2 py-0.5", status.bg)}>
                <AppText weight="medium" className={cn("text-xs", status.text)}>
                  {statusLabels[order.status]}
                </AppText>
              </View>
            </View>
            <AppText className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </AppText>
            {showUser && order.user && (
              <AppText className="text-sm text-foreground">
                {order.user.name} ({order.user.email})
              </AppText>
            )}
          </View>

          <Pressable
            onPress={onToggle}
            hitSlop={8}
            accessibilityLabel={
              expanded ? "Recolher pedido" : "Expandir pedido"
            }
            className="h-9 w-9 items-center justify-center"
          >
            {expanded ? (
              <ChevronUp size={20} color="#18181b" />
            ) : (
              <ChevronDown size={20} color="#18181b" />
            )}
          </Pressable>
        </View>

        <View className="mt-2 flex-row flex-wrap gap-4">
          <AppText className="text-sm text-muted-foreground">
            {deliveryTypeLabels[order.deliveryType]}
          </AppText>
          <AppText className="text-sm text-muted-foreground">
            {itemsLabel}
          </AppText>
          <AppText weight="medium" className="text-sm text-foreground">
            {priceFormatter.format(order.total)}
          </AppText>
        </View>

        {actions ? (
          <View className="mt-3 flex-row gap-2">{actions}</View>
        ) : null}
      </CardHeader>

      {expanded ? (
        <CardContent>
          <View className="gap-3 border-t border-border pt-4">
            <AppText weight="medium" className="text-foreground">
              Itens do pedido
            </AppText>

            <View className="gap-2">
              {order.items.map((item, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <Image
                    source={{
                      uri:
                        item.product?.imageUrl ||
                        "https://picsum.photos/400/400?random=0",
                    }}
                    contentFit="cover"
                    style={{ width: 48, height: 48, borderRadius: 4 }}
                    accessibilityLabel={item.name}
                  />
                  <View className="flex-1">
                    <AppText
                      weight="medium"
                      className="text-sm text-foreground"
                    >
                      {item.name}
                    </AppText>
                    <AppText className="text-xs text-muted-foreground">
                      {`${item.quantity}x ${priceFormatter.format(item.price)}${
                        item.observation ? ` • ${item.observation}` : ""
                      }`}
                    </AppText>
                  </View>
                  <AppText weight="medium" className="text-sm text-foreground">
                    {priceFormatter.format(item.price * item.quantity)}
                  </AppText>
                </View>
              ))}
            </View>

            <View className="gap-1 border-t border-border pt-3">
              <Row
                label="Subtotal"
                value={priceFormatter.format(order.subtotal)}
              />
              {order.deliveryFee > 0 && (
                <Row
                  label="Taxa de entrega"
                  value={priceFormatter.format(order.deliveryFee)}
                />
              )}
              {order.discount > 0 && (
                <Row
                  label={`Desconto${order.coupon ? ` (${order.coupon})` : ""}`}
                  value={`-${priceFormatter.format(order.discount)}`}
                  className="text-green-600"
                />
              )}
              <View className="flex-row justify-between pt-1">
                <AppText
                  weight="semibold"
                  className="text-base text-foreground"
                >
                  Total
                </AppText>
                <AppText
                  weight="semibold"
                  className="text-base text-foreground"
                >
                  {priceFormatter.format(order.total)}
                </AppText>
              </View>
            </View>

            {order.deliveryAddress && (
              <AppText className="text-sm text-foreground">
                <AppText className="text-muted-foreground">Endereço: </AppText>
                {order.deliveryAddress}
              </AppText>
            )}
          </View>
        </CardContent>
      ) : null}
    </Card>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View className="flex-row justify-between">
      <AppText className={cn("text-sm text-muted-foreground", className)}>
        {label}
      </AppText>
      <AppText className={cn("text-sm text-foreground", className)}>
        {value}
      </AppText>
    </View>
  );
}
