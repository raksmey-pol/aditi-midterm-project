import { getCustomerProfile, updateCustomerProfile, changePassword } from "@/lib/services/customer-profile.service";
import { Customer } from "@/lib/types/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const customerKeys = {
  all: ["customer"] as const,
  profile: () => [...customerKeys.all, "profile"] as const,
};

// Fetch customer profile
export function useCustomerProfile() {
  return useQuery({
    queryKey: customerKeys.profile(),
    queryFn: getCustomerProfile,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

// Update customer profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: (data: Customer) => {
      // Update the cache with new data
      queryClient.setQueryData(customerKeys.profile(), data);
    },
    onError: (error: Error) => {
      console.error("Profile update failed:", error);
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onError: (error: Error) => {
      console.error("Password change failed:", error);
    },
  });
}
