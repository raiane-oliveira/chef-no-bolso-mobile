import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CreditCardIcon,
  MoneyIcon,
  PhoneCallIcon,
  PixLogoIcon,
  WhatsappLogoIcon,
} from "phosphor-react-native";

const colors = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  border: "#262626",
  input: "rgba(255,255,255,0.08)",
  muted: "#a3a3a3",
};

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
  const today = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)

  return (
    <View style={styles.root}>
      <View style={styles.tabsList}>
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => setActiveTab(tab.value)}
              style={[styles.tabTrigger, isActive && styles.tabTriggerActive]}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "about" && (
          <View style={styles.aboutContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contato</Text>
              <View style={styles.row}>
                <Pressable
                  style={styles.outlineButton}
                  onPress={() => Linking.openURL("https://wa.me/5583999999999")}
                >
                  <WhatsappLogoIcon size={18} color={colors.foreground} />
                  <Text style={styles.buttonText}>(83) 9 9999-9999</Text>
                </Pressable>

                <Pressable
                  style={styles.outlineButton}
                  onPress={() => Linking.openURL("tel:+5583999999999")}
                >
                  <PhoneCallIcon
                    size={18}
                    weight="fill"
                    color={colors.foreground}
                  />
                  <Text style={styles.buttonText}>(83) 9 9999-9999</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              <View>
                <Text style={styles.text}>R. Odon Bezerra, 300</Text>
                <Text style={styles.text}>Liberdade, Campina Grande - PB</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "schedule" && (
          <View style={styles.scheduleContent}>
            {disponibilities.map((disponibility, i) => (
              <View
                key={disponibility.dayName}
                style={[
                  styles.scheduleItem,
                  i === today && styles.scheduleItemActive,
                ]}
              >
                <Text style={styles.text}>{disponibility.dayName}</Text>
                <Text style={[styles.text, styles.medium]}>
                  {disponibility.hour}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "payment" && (
          <View style={styles.paymentContent}>
            {paymentMethods.map(({ label, Icon, weight }) => (
              <View key={label} style={styles.paymentItem}>
                <Icon size={18} weight={weight} color={colors.foreground} />
                <Text style={styles.text}>{label}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabTrigger: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabTriggerActive: {
    borderBottomColor: colors.foreground,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
  tabLabelActive: {
    color: colors.foreground,
  },
  content: {
    paddingBottom: 16,
  },
  aboutContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    minHeight: 344,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.foreground,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
  },
  text: {
    fontSize: 16,
    color: colors.foreground,
  },
  medium: {
    fontWeight: "500",
  },
  scheduleContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    width: "100%",
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 6,
    width: "100%",
  },
  scheduleItemActive: {
    backgroundColor: colors.input,
  },
  paymentContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    minHeight: 344,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.input,
  },
});
