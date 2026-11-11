import { RoleGate } from "@/features/auth/ui/role-gate";
import { Screen } from "@/shared/ui/screen";
import { Card } from "@/shared/ui/card";
import { useRouter } from "expo-router";
import { Bike, ChevronRight, Package } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function AdminHome() {
  const router = useRouter();

  const items = [
    { label: "Produtos", href: "/admin/products", icon: Package },
    { label: "Entregadores", href: "/admin/entregadores", icon: Bike },
  ] as const;

  return (
    <RoleGate role="ADMIN" title="Administração">
      <Screen safeTop={false}>
        {items.map(({ label, href, icon: Icon }) => (
          <Pressable key={href} onPress={() => router.push(href)}>
            <Card>
              <View className="flex-row items-center gap-3 p-4">
                <Icon size={22} color="#18181b" />
                <Text className="flex-1 text-base font-medium text-foreground">
                  {label}
                </Text>
                <ChevronRight size={20} color="#71717a" />
              </View>
            </Card>
          </Pressable>
        ))}
      </Screen>
    </RoleGate>
  );
}
