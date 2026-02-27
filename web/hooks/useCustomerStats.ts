import { useQuery } from "@tanstack/react-query";
import { CustomerStats } from "@/lib/types/customer";
import { fetchCustomerStats } from "@/lib/services/customer-profile.service";

export const useCustomerStats = () =>
  useQuery<CustomerStats, Error>({
    queryKey: ["customerStats"],
    queryFn: fetchCustomerStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
