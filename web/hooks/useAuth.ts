import { changePassword, ChangePasswordPayload, getCustomerProfile, updateProfile, UpdateProfilePayload } from "@/lib/services/customer-profile.service";
import { Customer } from "@/lib/types/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  return useQuery<Customer, Error>({
    queryKey: ["auth", "me"],
    queryFn: getCustomerProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
  });
};