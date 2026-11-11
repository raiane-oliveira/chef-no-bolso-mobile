import { useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import {
  CreditCardIcon,
  MoneyIcon,
  PhoneCallIcon,
  PixLogoIcon,
  WhatsappLogoIcon,
} from "phosphor-react-native";
import { AppText } from "@/shared/ui/app-text";

type TabKey = "about" | "schedule" | "payment";

const tabs: { value: TabKey; label: string }[] = [
  { value: "about", label: "Sobre" },
  { value: "schedule", label: "Horário" },
  { value: "payment", label: "Pagamento" },
];

const disponibilities = [
  { dayName: "Domingo", hour: "10:00 às 17:30" },
  { dayName: "Segunda", hour: "10:00 às 18:00" },
  { dayName: "Terça", hour: "10:00 às 18:00" },
  { dayName: "Quarta", hour: "10:00 às 18:00" },
  { dayName: "Quinta", hour: "10:00 às 18:00" },
  { dayName: "Sexta", hour: "10:00 às 18:00" },
  { dayName: "Sábado", hour: "10:00 às 18:00" },
];

const paymentMethods = [
  { label: "Dinheiro", Icon: MoneyIcon, weight: "regular" as const },
  { label: "Pix", Icon: PixLogoIcon, weight: "fill" as const },
  {
    label: "Cartão de Crédito",
    Icon: CreditCardIcon,
    weight: "regular" as const,
  },
  { label: "Cartão de Débito", Icon: CreditCardIcon, weight: "fill" as const },
];

export function CompanyInfoContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const today = new Date().getDay();

  return (
    <View className="w-full">
      {/* Tabs */}
      <View className="w-full flex-row border-b border-border">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => setActiveTab(tab.value)}
              className={`flex-1 items-center border-b-2 py-2.5 ${
                isActive ? "border-foreground" : "border-transparent"
              }`}
            >
              <AppText
                weight="medium"
                className={`text-sm ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerClassName="pb-4">
        {/* About */}
        {activeTab === "about" && (
          <View className="min-h-[344px] gap-4 px-6 pt-4">
            <View className="gap-2">
              <AppText weight="semibold" className="text-lg text-foreground">
                Contato
              </AppText>

              <View className="flex-row text-sea-ink flex-wrap gap-4">
                <Pressable
                  onPress={() => Linking.openURL("https://wa.me/5583999999999")}
                  className="flex-row items-center gap-2 rounded-md border border-border px-4 py-2.5"
                >
                  <WhatsappLogoIcon size={18} color="currentColor" />
                  <AppText weight="medium" className="text-sm">
                    (83) 9 9999-9999
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => Linking.openURL("tel:+5583999999999")}
                  className="flex-row items-center gap-2 rounded-md border border-border px-4 py-2.5"
                >
                  <PhoneCallIcon size={18} weight="fill" />
                  <AppText weight="medium" className="text-sm">
                    (83) 9 9999-9999
                  </AppText>
                </Pressable>
              </View>
            </View>

            <View className="gap-2">
              <AppText weight="semibold" className="text-lg text-foreground">
                Endereço
              </AppText>

              <View>
                <AppText className="text-base text-foreground">
                  R. Odon Bezerra, 300
                </AppText>
                <AppText className="text-base text-foreground">
                  Liberdade, Campina Grande - PB
                </AppText>
              </View>
            </View>
          </View>
        )}

        {/* Schedule */}
        {activeTab === "schedule" && (
          <View className="w-full px-4 pt-2">
            {disponibilities.map((disponibility, index) => (
              <View
                key={disponibility.dayName}
                className={`w-full flex-row justify-between rounded-md p-3 ${
                  index === today ? "bg-input/50" : ""
                }`}
              >
                <AppText className="text-base text-foreground">
                  {disponibility.dayName}
                </AppText>

                <AppText weight="medium" className="text-base text-foreground">
                  {disponibility.hour}
                </AppText>
              </View>
            ))}
          </View>
        )}

        {/* Payment */}
        {activeTab === "payment" && (
          <View className="min-h-[344px] flex-row flex-wrap content-start items-start justify-center gap-4 px-4 pt-4">
            {paymentMethods.map(({ label, Icon, weight }) => (
              <View
                key={label}
                className="flex-row items-center text-sea-ink gap-2.5 rounded bg-input/50 px-4 py-2"
              >
                <Icon size={18} weight={weight} />
                <AppText className="text-base text-sea-ink">{label}</AppText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
