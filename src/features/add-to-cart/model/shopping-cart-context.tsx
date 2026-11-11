import type { ChildrenProps } from "@/shared/lib/shared-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface Order {
  id: string;
  name: string;
  imgUrl: string;
  description: string;
  price: number;
  observation?: string;
  amountInShoppingCart: number;
}

export type DeliveryType = "entrega" | "retirada" | "consumo-no-local";

interface DeliveryOption {
  type: DeliveryType;
  address?: string;
  price: number;
}

interface ShoppingCartContext {
  orders: Order[];
  delivery?: DeliveryOption;
  totalItemsInCart: number;
  totalValue: number;
  updateAmountInCart: (orderId: string, amount: number) => void;
  addToCart: (order: Order) => void;
  clearCart: (orderId?: string) => void;
  updateDeliveryOption: (deliveryOption: DeliveryOption) => void;
}

type ShoppingCartState = {
  orders: Order[];
  delivery?: DeliveryOption;
};

const STORAGE_KEY = "@chef-no-bolso:shopping-cart-state-1.0.0";

const ShoppingCartContext = createContext<ShoppingCartContext | null>(null);

export function ShoppingCartContextProvider({ children }: ChildrenProps) {
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartState>({
    orders: [],
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restoreCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && !cancelled) {
          setShoppingCart(JSON.parse(stored) as ShoppingCartState);
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    restoreCart();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingCart)).catch(
      () => {},
    );
  }, [shoppingCart, isHydrated]);

  const totalItemsInCart = shoppingCart.orders.reduce(
    (acc, order) => acc + order.amountInShoppingCart,
    0,
  );

  const totalValue = shoppingCart.orders.reduce(
    (acc, order) => acc + order.price * order.amountInShoppingCart,
    0,
  );

  function addToCart(order: Order) {
    setShoppingCart((prev) => {
      const alreadyInCart = prev.orders.some((o) => o.id === order.id);

      if (!alreadyInCart) {
        return { ...prev, orders: [...prev.orders, order] };
      }

      return {
        ...prev,
        orders: prev.orders.map((o) => (o.id === order.id ? order : o)),
      };
    });
  }

  function clearCart(orderId?: string) {
    setShoppingCart((prev) => ({
      ...prev,
      orders: orderId ? prev.orders.filter((o) => o.id !== orderId) : [],
    }));
  }

  function updateAmountInCart(orderId: string, amount: number) {
    setShoppingCart((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, amountInShoppingCart: amount } : o,
      ),
    }));
  }

  function updateDeliveryOption(deliveryOption: DeliveryOption) {
    setShoppingCart((prev) => ({ ...prev, delivery: deliveryOption }));
  }

  return (
    <ShoppingCartContext
      value={{
        orders: shoppingCart.orders,
        delivery: shoppingCart.delivery,
        totalItemsInCart,
        totalValue,
        addToCart,
        clearCart,
        updateAmountInCart,
        updateDeliveryOption,
      }}
    >
      {children}
    </ShoppingCartContext>
  );
}

export const useShoppingCartContext = () => {
  const context = useContext(ShoppingCartContext);

  if (!context) {
    throw new Error(
      "useShoppingCartContext must be used within a ShoppingCartContextProvider",
    );
  }

  return context;
};
