import { ProductCard } from "@/entities/product/ui/product-card";
import { useCategories } from "@/features/get-categories/model/get-categories";
import type { Category, Product } from "@/shared/api/types";
import { cn } from "@/shared/lib/utils";
import { AppText } from "@/shared/ui/app-text";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Sheet } from "@/shared/ui/sheet";
import { CompanyInfoContent } from "@/widgets/company-info-content";
import { Footer } from "@/widgets/footer";
import { Image } from "expo-image";
import { ChefHat, MapPin, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

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
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories: Category[] = categoriesData?.categories || [];

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <View className="flex-1 bg-base">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
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

          <AppText weight="bold" className="text-2xl text-foreground">
            ChefNoBolso
          </AppText>

          <AppText className="text-sm text-destructive">
            Fechado • Abrimos amanhã às 10h00
          </AppText>

          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color="#52525b" />
            <AppText className="text-sm text-gray-600">
              Campina Grande - PB
            </AppText>
          </View>

          <Button
            variant="link"
            onPress={() => setInfoOpen(true)}
            className="h-auto p-0"
            textClassName="text-gray-600 font-semibold"
          >
            Mais informações
          </Button>
        </View>

        {/* Categorias + busca */}
        <View className="gap-3 px-3 pt-5">
          {isCategoriesLoading ? (
            <AppText className="text-sm text-muted-foreground">
              Carregando categorias...
            </AppText>
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
                        <AppText
                          className={cn(
                            "text-sm",
                            active
                              ? "text-primary-foreground"
                              : "text-foreground",
                          )}
                        >
                          {category.name}
                        </AppText>
                      </Pressable>
                    );
                  },
                )}
              </View>
            </ScrollView>
          )}

          <View className="bg-white">
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
        </View>

        {/* Destaques: scroll horizontal */}
        <View className="gap-3 pt-6">
          <AppText weight="semibold" className="px-3 text-2xl text-foreground">
            Destaques
          </AppText>
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
            <AppText weight="semibold" className="text-2xl text-foreground">
              Os mais vendidos
            </AppText>
            <AppText weight="light" className="text-muted-foreground">
              Os melhores dindins do nosso cardápio, os mais vendidos! Esses vão
              te surpreender.
            </AppText>
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
            <AppText weight="semibold" className="text-2xl text-foreground">
              Dindins Gourmets
            </AppText>
            <AppText weight="light" className="text-muted-foreground">
              Nossa variedade de sabores irresistíveis!
            </AppText>
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

      {/* Dialog "Mais informações" */}
      <Sheet
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="ChefNoBolso"
        icon={<ChefHat size={26} color="#18181b" />}
      >
        <CompanyInfoContent />
      </Sheet>
    </View>
  );
}
