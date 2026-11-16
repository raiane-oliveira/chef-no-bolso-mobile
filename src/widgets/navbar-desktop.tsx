import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  HouseIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  SignOutIcon,
  ListIcon,
  UserCircleIcon,
  PackageIcon,
} from "phosphor-react-native";
import { ChefHat } from "lucide-react-native";

import { useAuthContext } from "@/features/auth/model/authentication-context";
import { useShoppingCartContext } from "@/features/add-to-cart/model/shopping-cart-context";
import { AsideShoppingCart } from "@/features/add-to-cart/ui/aside-shopping-cart";
import { priceFormatter } from "@/shared/lib/formatters";
import { NavLink } from "@/shared/ui/nav-link";
import { Input } from "@/shared/ui/input";
import { AppText } from "@/shared/ui/app-text";
import { Sheet } from "@/shared/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function NavbarDesktop() {
  const { session, handleLogout } = useAuthContext();
  const { orders, totalItemsInCart, totalValue } = useShoppingCartContext();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as never);
  };

  return (
    <View className="z-50 w-full border-b border-line bg-header-bg">
      <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between gap-6 px-4 py-4">
        {/* Logo */}
        <Pressable
          onPress={() => navigate("/")}
          className="flex-row items-center gap-2"
        >
          <ChefHat size={32} color="#18181b" />
          <AppText weight="medium" className="text-lg">
            ChefNoBolso
          </AppText>
        </Pressable>

        {/* Busca */}
        <View className="relative w-full max-w-xs flex-1">
          <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <MagnifyingGlassIcon size={16} />
          </View>
          <Input
            placeholder="Busque por um produto"
            className="h-12 pl-9"
            accessibilityLabel="Busque por um produto"
          />
        </View>

        {/* Links */}
        <View className="flex-row items-center gap-3">
          <NavLink
            to="/"
            label="Início"
            icon={HouseIcon}
            active={isActive("/")}
          />

          {session?.role !== "DELIVERY" && (
            <NavLink
              to="/orders"
              label="Pedidos"
              icon={ShoppingBagIcon}
              active={isActive("/orders")}
            />
          )}

          {/* Carrinho  */}
          {orders.length > 0 && (
            <Pressable
              onPress={() => setCartOpen(true)}
              className="flex-row items-center gap-2 rounded-md bg-primary px-3 py-2 active:opacity-90"
            >
              <ShoppingBagIcon size={20} color="#fff" />
              <AppText className="text-primary-foreground">
                {totalItemsInCart} · {priceFormatter.format(totalValue)}
              </AppText>
            </Pressable>
          )}

          {session ? (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger className="w-24 flex-col items-center gap-1 rounded-md px-2 py-1">
                <UserIcon size={20} weight="bold" />
                <AppText className="text-xs">Minha conta</AppText>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                {session.role !== "ADMIN" && (
                  <>
                    <DropdownMenuItem onPress={() => navigate("/account")}>
                      <UserCircleIcon size={18} />
                      <AppText>Meus dados</AppText>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() =>
                        navigate(
                          session.role === "DELIVERY"
                            ? "/deliveries"
                            : "/orders",
                        )
                      }
                    >
                      <ListIcon size={18} />
                      <AppText>
                        {session.role === "DELIVERY"
                          ? "Minhas entregas"
                          : "Meus pedidos"}
                      </AppText>
                    </DropdownMenuItem>
                  </>
                )}

                {session.role === "ADMIN" && (
                  <>
                    <DropdownMenuItem
                      onPress={() => navigate("/admin/products")}
                    >
                      <PackageIcon size={18} />
                      <AppText>Gerenciar produtos</AppText>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onPress={() => navigate("/admin/entregadores")}
                    >
                      <AppText>Gerenciar entregadores</AppText>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onPress={handleLogout} destructive>
                  <SignOutIcon size={18} color="#DC2626" />
                  <AppText className="text-red-600">Sair</AppText>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink
              to="/auth/login"
              label="Login"
              icon={UserIcon}
              active={isActive("/auth/login")}
            />
          )}
        </View>
      </View>

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
