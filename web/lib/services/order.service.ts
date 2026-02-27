// lib/services/order.service.ts
import { Order, OrderResponse } from "@/lib/types/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getToken = (): string => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  return token;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export interface PlaceOrderRequest {
  shippingAddressId: string;
}

export const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/mine`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.status}`);
  }

  return response.json();
};

export const placeOrder = async (
  data: PlaceOrderRequest,
): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to place order");
  }

  return response.json();
};
