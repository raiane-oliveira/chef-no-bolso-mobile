import { AppText } from "@/shared/ui/app-text";
import { useState } from "react";
import { Image, Linking, Pressable, View, type ViewProps } from "react-native";

interface FooterProps extends ViewProps {}

interface Developer {
  username: string;
  name: string;
  fallback: string;
}

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
      className={`h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-bg-base bg-sea-ink ${overlap ? "-ml-2" : ""}`}
    >
      {failed ? (
        <AppText weight="medium" className="text-xs text-foam">
          {developer.fallback}
        </AppText>
      ) : (
        <Image
          source={{ uri: `https://github.com/${developer.username}.png` }}
          accessibilityLabel={`@${developer.username}`}
          className="h-full w-full"
          onError={() => setFailed(true)}
        />
      )}
    </Pressable>
  );
}

export function Footer({ className, ...props }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <View
      {...props}
      className={`mt-20 items-center justify-between gap-4 border-t border-line px-4 py-7 ${className ?? ""}`}
    >
      <AppText className="text-sm text-muted-foreground text-center">
        © {year} ChefNoBolso. Todos os direitos reservados.
      </AppText>

      <View className="flex-row items-center gap-2">
        <AppText className="text-sm text-muted-foreground">
          Desenvolvido por
        </AppText>

        <View className="flex-row items-center">
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
