import { useState } from "react";
import { View } from "react-native";
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

export function Navbar() {
  const { session, handleLogout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path as never);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 border-t border-line bg-header-bg px-2 pb-3 pt-2">
      <View className="mx-auto w-full flex-row items-center justify-between gap-1">
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
    </View>
  );
}
