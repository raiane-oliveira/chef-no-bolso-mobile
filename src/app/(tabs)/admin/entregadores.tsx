import { useAuthContext } from "@/features/auth/model/authentication-context";
import { RoleGate } from "@/features/auth/ui/role-gate";
import { API_URL } from "@/shared/config/env";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Screen } from "@/shared/ui/screen";
import { Sheet } from "@/shared/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

interface Deliverer {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  veiculo: { tipo: "moto" | "carro" | "bicicleta" | "a_pe" };
  status: string;
  userId: string;
}

const emptyForm = { name: "", email: "", phone: "", password: "" };
type DelivererForm = typeof emptyForm;

export default function DeliverersScreen() {
  return (
    <RoleGate role="ADMIN" title="Gerenciar Entregadores">
      <DeliverersContent />
    </RoleGate>
  );
}

function DeliverersContent() {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<DelivererForm>(emptyForm);

  const patch = (values: Partial<DelivererForm>) =>
    setForm((f) => ({ ...f, ...values }));

  const { data, isLoading } = useQuery({
    queryKey: ["admin-deliverers"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/deliveries/users?limit=100`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch deliverers");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: DelivererForm) => {
      const response = await fetch(`${API_URL}/auth/register/deliverer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create deliverer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deliverers"] });
      closeSheet();
    },
    onError: () =>
      Alert.alert("Erro", "Não foi possível adicionar o entregador."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to delete deliverer");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-deliverers"] }),
    onError: () =>
      Alert.alert("Erro", "Não foi possível excluir o entregador."),
  });

  const deliverers: Deliverer[] = data?.entregadores || [];

  function closeSheet() {
    setForm(emptyForm);
    setIsOpen(false);
  }

  function handleSubmit() {
    if (!form.name || !form.email || !form.phone) {
      Alert.alert("Campos obrigatórios", "Preencha nome, email e telefone.");
      return;
    }
    createMutation.mutate(form);
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir entregador",
      "Tem certeza que deseja excluir este entregador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  }

  return (
    <Screen safeTop={false}>
      <Button onPress={() => setIsOpen(true)}>
        <Plus size={18} color="#fff" />
        Adicionar Entregador
      </Button>

      {isLoading ? (
        <Text className="py-10 text-center text-foreground">
          Carregando entregadores...
        </Text>
      ) : deliverers.length === 0 ? (
        <Text className="py-10 text-center text-muted-foreground">
          Nenhum entregador encontrado.
        </Text>
      ) : (
        <View className="gap-3">
          {deliverers.map((d) => (
            <Card key={d.id}>
              <View className="flex-row items-center justify-between gap-3 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-foreground">{d.nome}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {d.email}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {d.telefone}
                  </Text>
                </View>
                <Button
                  variant="outline"
                  size="icon"
                  onPress={() => handleDelete(d.userId)}
                >
                  <Trash2 size={16} color="#dc2626" />
                </Button>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Sheet
        visible={isOpen}
        onClose={closeSheet}
        title="Adicionar Entregador"
        description="Preencha as informações para adicionar um novo entregador."
        footer={
          <>
            <Button variant="outline" onPress={closeSheet}>
              Cancelar
            </Button>
            <Button onPress={handleSubmit} disabled={createMutation.isPending}>
              Adicionar
            </Button>
          </>
        }
      >
        <View className="gap-2">
          <Label>Nome</Label>
          <Input value={form.name} onChangeText={(name) => patch({ name })} />
        </View>
        <View className="gap-2">
          <Label>Email</Label>
          <Input
            value={form.email}
            onChangeText={(email) => patch({ email })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="gap-2">
          <Label>Telefone</Label>
          <Input
            value={form.phone}
            onChangeText={(phone) => patch({ phone })}
            keyboardType="phone-pad"
          />
        </View>
        <View className="gap-2">
          <Label>Senha</Label>
          <Input
            value={form.password}
            onChangeText={(password) => patch({ password })}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </Sheet>
    </Screen>
  );
}
