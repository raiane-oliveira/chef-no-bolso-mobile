import { ProductCard } from "@/entities/product/ui/product-card";
import { useShoppingCartContext } from "@/features/add-to-cart/model/shopping-cart-context";
import { AsideShoppingCart } from "@/features/add-to-cart/ui/aside-shopping-cart";
import { useCategories } from "@/features/get-categories/model/get-categories";
import type { Category, Product } from "@/shared/api/types";
import { priceFormatter } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Sheet } from "@/shared/ui/sheet";
import { CompanyInfoContent } from "@/widgets/company-info-content";
import { Footer } from "@/widgets/footer";
import { Image } from "expo-image";
import {
  ChefHat,
  Gift,
  MapPin,
  Search,
  ShoppingBag,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function mockProducts(count: number, size: number): Product[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `product-${i}`,
    name: `Produto ${i + 1}`,
    description: LOREM,
    price: (i + 1) * 10,
    imageUrl: `https://picsum.photos/${size}/${size}?random=${i + 1}`,
  }));
}

export default function HomeScreen() {
  const { orders, totalItemsInCart, totalValue } = useShoppingCartContext();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories: Category[] = categoriesData?.categories || [];

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const hasCart = orders.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: hasCart ? 88 : 24 }}
      >
        {/* Capa */}
        <Image
          source={{ uri: "https://picsum.photos/1200/300" }}
          contentFit="cover"
          style={{ width: "100%", height: 256 }}
        />

        {/* Perfil */}
        <View className="-mt-2 items-center gap-2 rounded-t-lg bg-card px-4 pb-4">
          <View className="-mt-14 rounded-full bg-white p-1.5 shadow-md">
            <Image
              source={{ uri: "https://picsum.photos/400/400" }}
              contentFit="cover"
              style={{ width: 108, height: 108, borderRadius: 54 }}
            />
          </View>

          <Text className="text-2xl font-bold text-foreground">
            ChefNoBolso
          </Text>

          <Text className="text-sm text-destructive">
            Fechado • Abrimos amanhã às 10h00
          </Text>

          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color="#52525b" />
            <Text className="text-sm text-gray-600">Campina Grande - PB</Text>
          </View>

          <Button
            variant="link"
            onPress={() => setInfoOpen(true)}
            className="h-auto p-0"
          >
            Mais informações
          </Button>
        </View>

        {/* Programa de fidelidade */}
        <View className="px-3 pt-4">
          <Card>
            <CardHeader className="flex-row items-center gap-2 px-4 pb-0">
              <View className="size-9 items-center justify-center rounded-full bg-destructive">
                <Gift size={20} color="#fff" />
              </View>
              <CardTitle className="text-sm">Programa de fidelidade</CardTitle>
            </CardHeader>
            <CardContent className="mt-3 gap-2">
              <Text className="text-sm text-gray-800">
                A cada <Text className="font-bold">R$ 1,00</Text> em compras
                você ganha <Text className="font-bold">1 ponto</Text> que pode
                ser trocado por prêmios.
              </Text>
              <Text className="text-sm text-gray-800">
                Os novos clientes ganham automaticamente{" "}
                <Text className="font-bold">50 pontos</Text>.
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Categorias + busca */}
        <View className="gap-3 px-3 pt-5">
          <View>
            <View className="pointer-events-none absolute left-3 top-3 z-10">
              <Search size={16} color="#71717a" />
            </View>
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder="Busque por um produto"
              accessibilityLabel="Busque por um produto"
              className="h-12 pl-9"
            />
          </View>

          {isCategoriesLoading ? (
            <Text className="text-sm text-muted-foreground">
              Carregando categorias...
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {[{ id: null, name: "Todas" }, ...categories].map(
                  (category) => {
                    const active = categoryId === category.id;
                    return (
                      <Pressable
                        key={category.id ?? "all"}
                        onPress={() => setCategoryId(category.id)}
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
                            active
                              ? "text-primary-foreground"
                              : "text-foreground",
                          )}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Destaques: scroll horizontal */}
        <View className="gap-3 pt-6">
          <Text className="px-3 text-2xl font-semibold text-foreground">
            Destaques
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4 px-3">
              {mockProducts(3, 400).map((product) => (
                <View key={product.id} style={{ width: 270 }}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="gap-3 px-3 pt-8">
          <View className="gap-2">
            <Text className="text-2xl font-semibold text-foreground">
              Os mais vendidos
            </Text>
            <Text className="font-light text-muted-foreground">
              Os melhores dindins do nosso cardápio, os mais vendidos! Esses vão
              te surpreender.
            </Text>
          </View>
          <View className="gap-4">
            {mockProducts(6, 400).map((product) => (
              <ProductCard
                key={product.id}
                orientation="horizontal"
                product={product}
              />
            ))}
          </View>
        </View>

        <View className="gap-3 px-3 pt-8">
          <View className="gap-2">
            <Text className="text-2xl font-semibold text-foreground">
              Dindins Gourmets
            </Text>
            <Text className="font-light text-muted-foreground">
              Nossa variedade de sabores irresistíveis!
            </Text>
          </View>
          <View className="gap-4">
            {mockProducts(9, 200).map((product) => (
              <ProductCard
                key={product.id}
                orientation="horizontal"
                product={product}
              />
            ))}
          </View>
        </View>

        <Footer />
      </ScrollView>

      {/* Barra "Ver sacola" */}
      {hasCart && (
        <Pressable
          onPress={() => setCartOpen(true)}
          className="fixed w-full left-0 z-50 bottom-[72.5px] flex-row items-center justify-between bg-primary px-4 py-3 active:opacity-90"
        >
          <View>
            <ShoppingBag size={28} color="#fff" />
            <View className="absolute -bottom-1 -right-2 size-5 items-center justify-center rounded-full bg-card">
              <Text className="text-xs text-accent-foreground">
                {totalItemsInCart}
              </Text>
            </View>
          </View>
          <Text className="text-base font-medium text-primary-foreground">
            Ver sacola
          </Text>
          <Text className="text-base text-primary-foreground">
            {priceFormatter.format(totalValue)}
          </Text>
        </Pressable>
      )}

      {/* Dialog "Mais informações" */}
      <Sheet
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="ChefNoBolso"
        icon={<ChefHat size={26} color="#18181b" />}
      >
        <CompanyInfoContent />
      </Sheet>

      {/* Dialog fullscreen da sacola */}
      <Sheet
        visible={cartOpen}
        onClose={() => setCartOpen(false)}
        title="ChefNoBolso"
        icon={<ChefHat size={26} color="#18181b" />}
        scroll={false}
      >
        <AsideShoppingCart />
      </Sheet>
    </View>
  );
}
