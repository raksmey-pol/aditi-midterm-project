import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressFormValues } from "@/schemas/address-validation";
import { createAddress, getMyAddresses } from "@/lib/services/addresses.service";

// 1. Hook to FETCH all addresses
export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getMyAddresses,
  });
};

// 2. Hook to CREATE a new address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddressFormValues) => createAddress(data),
    onSuccess: () => {
      // This tells React Query: "Hey, new data was added! Refresh the address list instantly."
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
