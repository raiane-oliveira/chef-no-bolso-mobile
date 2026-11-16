import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { priceFormatter } from "@/shared/lib/formatters";
import {
  HouseIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  SignOutIcon,
  ListIcon,
  UserCircleIcon,
  PackageIcon,
  ShoppingBag,
} from "phosphor-react-native";

import { useAuthContext } from "@/features/auth/model/authentication-context";
import { NavLink } from "@/shared/ui/nav-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { AppText } from "@/shared/ui/app-text";
import { useShoppingCartContext } from "@/features/add-to-cart/model/shopping-cart-context";
import { Sheet } from "@/shared/ui/sheet";
import { AsideShoppingCart } from "@/features/add-to-cart/ui/aside-shopping-cart";
import { ChefHat } from "lucide-react-native";

export function NavbarMobile() {
  const [cartOpen, setCartOpen] = useState(false);
  const { session, handleLogout } = useAuthContext();
  const { orders, totalItemsInCart, totalValue } = useShoppingCartContext();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hasCart = orders.length > 0;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as never);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50">
      {/* Barra "Ver sacola" */}
      {hasCart && (
        <Pressable
          onPress={() => setCartOpen(true)}
          className="w-full flex-row items-center justify-between bg-primary px-4 py-3 active:opacity-90"
        >
          <View>
            <ShoppingBag size={28} color="#fff" />
            <View className="absolute -bottom-1 -right-2 size-5 items-center justify-center rounded-full bg-card">
              <AppText className="text-xs text-accent-foreground">
                {totalItemsInCart}
              </AppText>
            </View>
          </View>
          <AppText
            weight="medium"
            className="text-base text-primary-foreground"
          >
            Ver sacola
          </AppText>
          <AppText className="text-base text-primary-foreground">
            {priceFormatter.format(totalValue)}
          </AppText>
        </Pressable>
      )}

      <View className="mx-auto w-full flex-row items-center border-t border-line bg-header-bg px-2 pb-3 pt-2 justify-between gap-1">
        <NavLink
          to="/"
          label="Início"
          icon={HouseIcon}
          active={isActive("/")}
        />

        <NavLink
          to="#"
          label="Pesquisar"
          icon={MagnifyingGlassIcon}
          active={isActive("/search")}
        />

        <NavLink
          to="/orders"
          label="Pedidos"
          icon={ShoppingBagIcon}
          active={isActive("/orders")}
        />

        {session ? (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="w-20 flex-col items-center gap-1 rounded-md px-2 py-1">
              <UserIcon size={20} weight="bold" />
              <AppText className="text-xs text-lagoon-deep">
                Minha conta
              </AppText>
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
                        session.role === "DELIVERY" ? "/deliveries" : "/orders",
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onPress={() => navigate("/admin/products")}>
                    <PackageIcon size={18} />
                    <AppText>Gerenciar produtos</AppText>
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
