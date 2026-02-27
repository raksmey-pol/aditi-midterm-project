import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressFormValues } from "@/schemas/address-validation";
import { getMyAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from "@/lib/services/addresses.service";

export const useMyAddresses = () =>
  useQuery({
    queryKey: ["addresses"], // ← must match invalidateQueries key exactly
    queryFn: getMyAddresses,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

export const useAddressById = (id: string) =>
  useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddressById(id),
    enabled: !!id,
  });

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressFormValues) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressFormValues }) =>
      updateAddress(id, data),
    onSuccess: (updatedAddress, { id }) => {
      console.log("update success, invalidating..."); // ← add this
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["address", id] });
    },
    onError: (error) => {
      console.log("update error:", error); // ← and this
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
