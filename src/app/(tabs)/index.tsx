import { ProductCard } from "@/entities/product/ui/product-card";
import { ProductGrid } from "@/entities/product/ui/product-grid";
import { AsideShoppingCart } from "@/features/add-to-cart/ui/aside-shopping-cart";
import { useCategories } from "@/features/get-categories/model/get-categories";
import { CategorySelect } from "@/features/get-categories/ui/category-select";
import type { Category, Product } from "@/shared/api/types";
import { AppText } from "@/shared/ui/app-text";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ResponsiveDialog } from "@/shared/ui/responsive-dialog";
import { CompanyInfoContent } from "@/widgets/company-info-content";
import { Footer } from "@/widgets/footer";
import { Image } from "expo-image";
import { ChefHat, Gift, MapPin, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_LONG = `${LOREM_SHORT} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at vestibulum nisi, et luctus sapien. Praesent nec turpis tortor. Sed eget dapibus felis, in pharetra ex. Nunc sed neque vitae nibh porta ornare vel vel justo.`;

function mockProducts(count: number, size: number, long = false): Product[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `product-${i}`,
    name: `Produto ${i + 1}`,
    description: long ? LOREM_LONG : LOREM_SHORT,
    price: (i + 1) * 10,
    imageUrl: `https://picsum.photos/${size}/${size}?random=${i + 1}`,
  }));
}

const PAGE_WRAP = "w-full md:mx-auto md:max-w-7xl md:px-4";

export default function HomeScreen() {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories: Category[] = categoriesData?.categories || [];

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <View className="flex-1 bg-base">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-[120px] lg:pb-10"
      >
        <View className="relative z-0 md:pt-5">
          <View className="absolute inset-x-0 top-0 -z-10 h-[200px] bg-accent-foreground" />

          <View className={`${PAGE_WRAP} md:gap-5`}>
            {/* Capa */}
            <View className="h-64 w-full bg-white md:h-[336px] md:rounded-lg md:p-1">
              <View className="flex-1 overflow-hidden md:rounded-lg">
                <Image
                  source={{ uri: "https://picsum.photos/1200/300" }}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>

            <View className="gap-7 lg:flex-row lg:justify-between">
              {/* Perfil */}
              <View className="-mt-2 items-center gap-3 rounded-lg bg-card px-4 pb-1 md:-mb-[72px] md:ml-7 md:mt-0 md:flex-row md:items-start md:gap-6 md:rounded-none md:bg-transparent md:px-0 md:pb-0 lg:mb-0 lg:ml-12">
                {/* Avatar: círculo no mobile, quadrado arredondado e elevado no md */}
                <View className="-mt-14 rounded-full bg-white p-1.5 shadow-md md:mt-0 md:-translate-y-20 md:rounded-lg md:p-1">
                  <View className="size-[108px] overflow-hidden rounded-full md:size-[152px] md:rounded-lg">
                    <Image
                      source={{ uri: "https://picsum.photos/400/400" }}
                      contentFit="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                </View>

                <View className="items-center gap-2 md:items-start">
                  <AppText
                    weight="bold"
                    className="text-2xl text-foreground md:text-4xl"
                  >
                    ChefNoBolso
                  </AppText>

                  <View className="gap-2 md:flex-row md:flex-wrap md:items-center lg:flex-col lg:items-start">
                    <View className="flex-row flex-wrap items-center justify-center gap-2 md:justify-start">
                      <AppText className="text-sm !text-destructive md:text-base">
                        Fechado • Abrimos amanhã às 10h00
                      </AppText>

                      <AppText className="hidden text-gray-600 sm:flex">
                        •
                      </AppText>

                      <View className="flex-row items-center gap-2">
                        <MapPin size={14} color="#52525b" />
                        <AppText className="text-sm !text-gray-600 md:text-base">
                          Campina Grande - PB
                        </AppText>
                      </View>

                      <AppText className="hidden text-gray-600 sm:flex lg:hidden">
                        •
                      </AppText>
                    </View>

                    <Button
                      variant="link"
                      onPress={() => setInfoOpen(true)}
                      className="h-auto self-center p-0 md:self-auto"
                      textClassName="text-gray-600 font-semibold"
                    >
                      Mais informações
                    </Button>
                  </View>
                </View>
              </View>

              {/* Programa de fidelidade */}
              <View className="mx-3 gap-3 rounded-md border border-border bg-card py-3 md:mx-0 lg:w-80">
                <View className="flex-row items-center gap-2 px-4">
                  <View className="size-9 items-center justify-center rounded-full bg-destructive">
                    <Gift size={20} color="#fff" />
                  </View>
                  <AppText
                    weight="semibold"
                    className="text-sm text-foreground"
                  >
                    Programa de fidelidade
                  </AppText>
                </View>

                <View className="gap-2 px-4">
                  <AppText className="text-sm text-gray-800">
                    A cada{" "}
                    <AppText weight="bold" className="text-sm">
                      R$ 1,00
                    </AppText>{" "}
                    em compras você ganha{" "}
                    <AppText weight="bold" className="text-sm">
                      1 ponto
                    </AppText>{" "}
                    que pode ser trocado por prêmios.
                  </AppText>
                  <AppText className="text-sm text-gray-800">
                    Os novos clientes ganham automaticamente{" "}
                    <AppText weight="bold" className="text-sm">
                      50 pontos
                    </AppText>
                    .
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          <View className={`${PAGE_WRAP} mt-5 flex-row items-start gap-7`}>
            <View className="min-w-0 flex-1 gap-[34px]">
              {/* Categorias + busca */}
              <View className="flex-row justify-between gap-3 px-3 md:px-0">
                <CategorySelect
                  categories={categories}
                  value={categoryId}
                  onChange={setCategoryId}
                  loading={isCategoriesLoading}
                />

                <View className="hidden w-full md:ml-auto max-w-xs overflow-hidden rounded-md bg-card md:flex">
                  <View className="pointer-events-none absolute left-3 top-4 z-10">
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

                <Pressable
                  onPress={() => setSearchOpen(true)}
                  accessibilityLabel="Busque por um produto"
                  className="items-center justify-center rounded-md border border-input bg-card px-3 md:hidden"
                >
                  <Search size={20} color="#71717a" />
                </Pressable>
              </View>

              <View className="gap-5">
                <AppText
                  weight="semibold"
                  className="px-3 text-2xl text-foreground md:px-0"
                >
                  Destaques
                </AppText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-4 py-2 px-3 md:flex-grow md:px-0"
                >
                  {mockProducts(3, 400).map((product) => (
                    <View key={product.id} className="w-[270px] md:flex-1">
                      <ProductCard product={product} />
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Os mais vendidos */}
              <View className="gap-5 px-3 md:px-0">
                <View className="gap-2">
                  <AppText
                    weight="semibold"
                    className="text-2xl text-foreground"
                  >
                    Os mais vendidos
                  </AppText>
                  <AppText weight="light" className="text-muted-foreground">
                    Os melhores dindins do nosso cardápio, os mais vendidos!
                    Esses vão te surpreender.
                  </AppText>
                </View>
                <ProductGrid
                  items={mockProducts(6, 400, true)}
                  renderItem={(product) => (
                    <ProductCard orientation="horizontal" product={product} />
                  )}
                />
              </View>

              {/* Dindins Gourmets */}
              <View className="gap-5 px-3 md:px-0">
                <View className="gap-2">
                  <AppText
                    weight="semibold"
                    className="text-2xl text-foreground"
                  >
                    Dindins Gourmets
                  </AppText>
                  <AppText weight="light" className="text-muted-foreground">
                    Nossa variedade de sabores irresistíveis!
                  </AppText>
                </View>
                <ProductGrid
                  items={mockProducts(9, 200, true)}
                  renderItem={(product) => (
                    <ProductCard orientation="horizontal" product={product} />
                  )}
                />
              </View>
            </View>

            <View className="hidden w-80 lg:flex lg:sticky lg:top-5 lg:max-h-[calc(100vh-140px)]">
              <AsideShoppingCart />
            </View>
          </View>
        </View>

        <View className="mt-10">
          <Footer />
        </View>
      </ScrollView>

      {/* Dialog "Mais informações" */}
      <ResponsiveDialog
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="ChefNoBolso"
        icon={<ChefHat size={26} color="#18181b" />}
      >
        <CompanyInfoContent />
      </ResponsiveDialog>

      {/* Dialog "Pesquisar" (mobile) */}
      <ResponsiveDialog
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Pesquisar"
      >
        <View className="p-4">
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Busque por um produto"
            className="h-12"
            autoFocus
          />
        </View>
      </ResponsiveDialog>
    </View>
  );
}
