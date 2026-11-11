import { useAuthContext } from "@/features/auth/model/authentication-context";
import { RoleGate } from "@/features/auth/ui/role-gate";
import { API_URL } from "@/shared/config/env";
import { priceFormatter } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Screen } from "@/shared/ui/screen";
import { Sheet } from "@/shared/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { id: string; name: string };
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  featured: false,
};
type ProductForm = typeof emptyForm;

export default function ProductsScreen() {
  return (
    <RoleGate role="ADMIN" title="Gerenciar Produtos">
      <ProductsContent />
    </RoleGate>
  );
}

function ProductsContent() {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const patch = (values: Partial<ProductForm>) =>
    setForm((f) => ({ ...f, ...values }));

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products?limit=100`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: ProductForm }) => {
      const response = await fetch(
        id ? `${API_URL}/products/${id}` : `${API_URL}/products`,
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            price: Number(data.price.replace(",", ".")),
            imageUrl: data.imageUrl,
            category: data.categoryId,
            featured: data.featured,
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to save product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      closeSheet();
    },
    onError: () => Alert.alert("Erro", "Não foi possível salvar o produto."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    onError: () => Alert.alert("Erro", "Não foi possível excluir o produto."),
  });

  const products: Product[] = productsData?.products || [];
  const categories: Category[] = categoriesData?.categories || [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  function closeSheet() {
    setForm(emptyForm);
    setEditing(null);
    setIsOpen(false);
  }

  function openCreate() {
    setForm(emptyForm);
    setEditing(null);
    setIsOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      categoryId: product.category?.id || "",
      featured: product.featured,
    });
    setIsOpen(true);
  }

  function handleSubmit() {
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.imageUrl ||
      !form.categoryId
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos antes de salvar.",
      );
      return;
    }
    saveMutation.mutate({ id: editing?.id, data: form });
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja excluir este produto?",
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
      <View>
        <View className="pointer-events-none absolute left-3 top-3 z-10">
          <Search size={16} color="#71717a" />
        </View>
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChangeText={setSearch}
          className="pl-9"
        />
      </View>

      <Button onPress={openCreate}>
        <Plus size={18} color="#fff" />
        Adicionar Produto
      </Button>

      {isLoading ? (
        <Text className="py-10 text-center text-foreground">
          Carregando produtos...
        </Text>
      ) : filteredProducts.length === 0 ? (
        <Text className="py-10 text-center text-muted-foreground">
          {search
            ? "Nenhum produto encontrado para a busca."
            : "Nenhum produto encontrado."}
        </Text>
      ) : (
        <View className="gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <Image
                source={{ uri: product.imageUrl }}
                contentFit="cover"
                style={{ width: "100%", aspectRatio: 16 / 9 }}
                accessibilityLabel={product.name}
              />
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <Text
                  numberOfLines={2}
                  className="text-sm text-muted-foreground"
                >
                  {product.description}
                </Text>
              </CardHeader>
              <CardContent>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-foreground">
                    {priceFormatter.format(product.price)}
                  </Text>
                  <View className="flex-row gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={() => openEdit(product)}
                    >
                      <Pencil size={16} color="#18181b" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={() => handleDelete(product.id)}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </Button>
                  </View>
                </View>
                {product.category && (
                  <Text className="mt-2 text-xs text-muted-foreground">
                    Categoria: {product.category.name}
                  </Text>
                )}
              </CardContent>
            </Card>
          ))}
        </View>
      )}

      {/* Dialog de criar/editar */}
      <Sheet
        visible={isOpen}
        onClose={closeSheet}
        title={editing ? "Editar Produto" : "Adicionar Produto"}
        description={
          editing
            ? "Edite as informações do produto."
            : "Preencha as informações para adicionar um novo produto."
        }
        footer={
          <>
            <Button variant="outline" onPress={closeSheet}>
              Cancelar
            </Button>
            <Button onPress={handleSubmit} disabled={saveMutation.isPending}>
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </>
        }
      >
        <View className="gap-2">
          <Label>Nome</Label>
          <Input value={form.name} onChangeText={(name) => patch({ name })} />
        </View>
        <View className="gap-2">
          <Label>Descrição</Label>
          <Input
            value={form.description}
            onChangeText={(description) => patch({ description })}
          />
        </View>
        <View className="gap-2">
          <Label>Preço</Label>
          <Input
            value={form.price}
            onChangeText={(price) => patch({ price })}
            keyboardType="decimal-pad"
          />
        </View>
        <View className="gap-2">
          <Label>URL da Imagem</Label>
          <Input
            value={form.imageUrl}
            onChangeText={(imageUrl) => patch({ imageUrl })}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <View className="gap-2">
          <Label>Categoria</Label>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((category) => {
              const active = form.categoryId === category.id;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => patch({ categoryId: category.id })}
                  className={cn(
                    "rounded-full border px-4 py-2",
                    active
                      ? "border-primary bg-primary"
                      : "border-input bg-card",
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm",
                      active ? "text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Label>Produto em destaque</Label>
          <Switch
            value={form.featured}
            onValueChange={(featured) => patch({ featured })}
          />
        </View>
      </Sheet>
    </Screen>
  );
}
