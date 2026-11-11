export interface OrderItem {
  product: { id: string; name: string; imageUrl: string; price: number } | null;
  name: string;
  price: number;
  quantity: number;
  observation?: string;
}

export interface Order {
  id: string;
  user?: { id: string; name: string; email: string };
  items: OrderItem[];
  deliveryType: "entrega" | "retirada" | "consumo-no-local";
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivering"
    | "delivered"
    | "cancelled";
  coupon?: string;
  discount: number;
  createdAt: string;
}

export const statusLabels: Record<Order["status"], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivering: "Em entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const statusColors: Record<
  Order["status"],
  { bg: string; text: string }
> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800" },
  preparing: { bg: "bg-orange-100", text: "text-orange-800" },
  ready: { bg: "bg-purple-100", text: "text-purple-800" },
  delivering: { bg: "bg-indigo-100", text: "text-indigo-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-800" },
};

export const deliveryTypeLabels: Record<Order["deliveryType"], string> = {
  entrega: "Entrega",
  retirada: "Retirada",
  "consumo-no-local": "Consumo no local",
};
