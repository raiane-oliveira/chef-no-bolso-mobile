// widgets/product-grid.tsx
import { useState, type ReactNode } from "react";
import { View } from "react-native";

interface ProductGridProps<T extends { id: string }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  minItemWidth?: number;
  gap?: number;
}

export function ProductGrid<T extends { id: string }>({
  items,
  renderItem,
  minItemWidth = 350,
  gap = 16,
}: ProductGridProps<T>) {
  const [width, setWidth] = useState(0);

  // mesma conta do `repeat(auto-fit, minmax(350px, 1fr))`
  const cols = width
    ? Math.max(1, Math.floor((width + gap) / (minItemWidth + gap)))
    : 1;
  const itemWidth = width
    ? Math.floor((width - gap * (cols - 1)) / cols)
    : undefined;

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ flexDirection: "row", flexWrap: "wrap", gap }}
    >
      {items.map((item) => (
        <View key={item.id} style={{ width: itemWidth ?? "100%" }}>
          {renderItem(item)}
        </View>
      ))}
    </View>
  );
}
