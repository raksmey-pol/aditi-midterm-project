import { fetchMyOrders } from "@/lib/services/order.service";
import { Order } from "@/lib/types/order";
import { useQuery } from "@tanstack/react-query";

export const useMyOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["myOrders"], 
    queryFn: fetchMyOrders,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });
};
