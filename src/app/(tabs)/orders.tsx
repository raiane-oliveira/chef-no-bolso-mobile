import { OrderCard } from "@/entities/order/ui/order-card";
import type { Order } from "@/entities/order/model/types";
import { useAuthContext } from "@/features/auth/model/authentication-context";
import { SignInCard } from "@/features/auth/ui/sign-in-card";
import { API_URL } from "@/shared/config/env";
import { filterByDateRange } from "@/shared/lib/date-filter";
import { DateRangeFilter } from "@/shared/ui/date-range-filter";
import { Screen } from "@/shared/ui/screen";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { AppText } from "@/shared/ui/app-text";

export default function OrdersScreen() {
  const { session } = useAuthContext();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!session,
  });

  const orders: Order[] = data?.orders || [];
  const filteredOrders = useMemo(
    () => filterByDateRange(orders, startDate, endDate),
    [orders, startDate, endDate],
  );

  function clearFilters() {
    setStartDate("");
    setEndDate("");
  }

  return (
    <Screen className={session ? undefined : "items-center"}>
      <AppText weight="semibold" className="text-2xl text-foreground">
        {session?.role === "ADMIN" ? "Todos os pedidos" : "Seus pedidos"}
      </AppText>

      {!session ? (
        <SignInCard />
      ) : (
        <>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            onClear={clearFilters}
          />

          {isLoading ? (
            <AppText className="py-10 text-center text-foreground">
              Carregando pedidos...
            </AppText>
          ) : filteredOrders.length === 0 ? (
            <AppText className="py-10 text-center text-muted-foreground">
              {startDate || endDate
                ? "Nenhum pedido encontrado para o período selecionado."
                : "Nenhum pedido encontrado."}
            </AppText>
          ) : (
            <View className="gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  showUser={session.role === "ADMIN"}
                  expanded={expandedOrder === order.id}
                  onToggle={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                />
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}
