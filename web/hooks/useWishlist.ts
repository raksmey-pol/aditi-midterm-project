import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/lib/services/wishist.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/authcontext";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthContext();

  const {
    data: wishlistItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: isLoggedIn,
  });

  const { mutate: addToWishlist, isPending: isAdding } = useMutation({
    mutationFn: apiAddToWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: any[]) => [
        ...(old ?? []),
        { id: productId, productId },
      ]);
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["wishlist"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const { mutate: removeFromWishlist, isPending: isRemoving } = useMutation({
    mutationFn: apiRemoveFromWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previous = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: any[]) =>
        (old ?? []).filter(
          (item) => item.id !== productId && item.productId !== productId,
        ),
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["wishlist"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isAdding,
    isRemoving,
  };
};