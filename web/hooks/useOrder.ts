import { fetchMyOrders, fetchOrder } from "@/lib/services/order.service";
import { Order } from "@/lib/types/order";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { placeOrder, PlaceOrderRequest } from "@/lib/services/order.service";

export const useMyOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery<Order, Error>({
    queryKey: ["order", id], // Unique cache key for this specific order
    queryFn: () => fetchOrder(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};


export const usePlaceOrder = () =>
  useMutation({
    mutationFn: (data: PlaceOrderRequest) => placeOrder(data),
  });