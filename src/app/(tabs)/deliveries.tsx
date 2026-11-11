import { OrderCard } from "@/entities/order/ui/order-card";
import type { Order } from "@/entities/order/model/types";
import { useAuthContext } from "@/features/auth/model/authentication-context";
import { RoleGate } from "@/features/auth/ui/role-gate";
import { API_URL } from "@/shared/config/env";
import { filterByDateRange } from "@/shared/lib/date-filter";
import { DateRangeFilter } from "@/shared/ui/date-range-filter";
import { Screen } from "@/shared/ui/screen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "@/shared/ui/button";
import { AppText } from "@/shared/ui/app-text";

export default function DeliveriesScreen() {
  return (
    <RoleGate role="DELIVERY" title="Suas entregas" safeTop>
      <DeliveriesContent />
    </RoleGate>
  );
}

function DeliveriesContent() {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"ongoing" | "done">("ongoing");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const authHeaders = { Authorization: `Bearer ${session?.accessToken}` };

  const { data: ongoingData, isLoading: isLoadingOngoing } = useQuery({
    queryKey: ["ongoing-deliveries"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/deliveries/ongoing`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to fetch ongoing deliveries");
      return response.json();
    },
    enabled: !!session,
  });

  const { data: doneData, isLoading: isLoadingDone } = useQuery({
    queryKey: ["done-deliveries"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/deliveries/done`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to fetch done deliveries");
      return response.json();
    },
    enabled: !!session,
  });

  const finishMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`${API_URL}/deliveries/${orderId}/finish`, {
        method: "PATCH",
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to finish delivery");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ongoing-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["done-deliveries"] });
    },
    onError: () => Alert.alert("Erro", "Não foi possível finalizar a entrega."),
  });

  const ongoingOrders: Order[] = ongoingData?.orders || [];
  const doneOrders: Order[] = doneData?.orders || [];

  const filteredDoneOrders = useMemo(
    () => filterByDateRange(doneOrders, startDate, endDate),
    [doneOrders, startDate, endDate],
  );

  const orders = tab === "ongoing" ? ongoingOrders : filteredDoneOrders;
  const isLoading = tab === "ongoing" ? isLoadingOngoing : isLoadingDone;

  // confirm() do browser -> Alert.alert
  function handleFinish(orderId: string) {
    Alert.alert(
      "Finalizar entrega",
      "Confirmar entrega deste pedido como finalizada?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => finishMutation.mutate(orderId) },
      ],
    );
  }

  return (
    <Screen>
      <AppText weight="semibold" className="text-2xl text-foreground">
        Suas entregas
      </AppText>

      <View className="flex-row items-center gap-2">
        <Button
          variant={tab === "ongoing" ? "default" : "outline"}
          size="sm"
          onPress={() => setTab("ongoing")}
        >
          Em andamento
        </Button>
        <Button
          variant={tab === "done" ? "default" : "outline"}
          size="sm"
          onPress={() => setTab("done")}
        >
          Concluídas
        </Button>
      </View>

      {tab === "done" && (
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onClear={() => {
            setStartDate("");
            setEndDate("");
          }}
        />
      )}

      {isLoading ? (
        <AppText className="py-10 text-center text-foreground">
          Carregando pedidos...
        </AppText>
      ) : orders.length === 0 ? (
        <AppText className="py-10 text-center text-muted-foreground">
          {tab === "ongoing"
            ? "Nenhuma entrega em andamento no momento."
            : startDate || endDate
              ? "Nenhum pedido encontrado para o período selecionado."
              : "Nenhum pedido encontrado."}
        </AppText>
      ) : (
        <View className="gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              showUser
              expanded={expandedOrder === order.id}
              onToggle={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
              actions={
                tab === "ongoing" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleFinish(order.id)}
                    disabled={finishMutation.isPending}
                  >
                    <CircleCheck size={16} color="#18181b" />
                    Finalizar
                  </Button>
                ) : undefined
              }
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
