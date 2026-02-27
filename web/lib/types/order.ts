// lib/types/order.ts

export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  status?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  shippingAddress: string; // UUID as string
  items: OrderItem[];
  createdAt: string;
}

// used as the return type of placeOrder
export type OrderResponse = Order;
