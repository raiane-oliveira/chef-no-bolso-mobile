import { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

const colors = {
  line: "#262626",
  muted: "#a3a3a3",
  avatarBg: "#262626",
  avatarBorder: "#0a0a0a",
  foreground: "#fafafa",
};

interface FooterProps extends ViewProps {}

interface Developer {
  username: string;
  name: string;
  fallback: string;
}

// TODO: adicionar nome dos devs
const developers: Developer[] = [
  { username: "raiane-oliveira", name: "Raiane Oliveira", fallback: "RO" },
  { username: "kaio", name: "Kaio", fallback: "K?" },
  { username: "Lucas", name: "Lucas", fallback: "L?" },
  { username: "phlimadev", name: "phlimadev", fallback: "PL" },
];

function DeveloperAvatar({
  developer,
  overlap,
}: {
  developer: Developer;
  overlap: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={developer.name}
      onPress={() =>
        Linking.openURL(`https://github.com/${developer.username}`)
      }
      style={[styles.avatar, overlap && styles.avatarOverlap]}
    >
      {failed ? (
        <Text style={styles.avatarFallback}>{developer.fallback}</Text>
      ) : (
        <Image
          source={{ uri: `https://github.com/${developer.username}.png` }}
          accessibilityLabel={`@${developer.username}`}
          style={styles.avatarImage}
          onError={() => setFailed(true)}
        />
      )}
    </Pressable>
  );
}

export function Footer({ style, ...props }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <View {...props} style={[styles.footer, style]}>
      <Text style={styles.copy}>
        &copy; {year} ChefNoBolso. Todos os direitos reservados.
      </Text>

      <View style={styles.developedBy}>
        <Text style={styles.copy}>Desenvolvido por</Text>
        <View style={styles.avatarGroup}>
          {developers.map((developer, index) => (
            <DeveloperAvatar
              key={developer.username}
              developer={developer}
              overlap={index > 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 80,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  copy: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  developedBy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.avatarBorder,
    backgroundColor: colors.avatarBg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    fontSize: 12,
    color: colors.foreground,
  },
});
