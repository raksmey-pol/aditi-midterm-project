import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/lib/services/wishist.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useWishlist = () => {
  const queryClient = useQueryClient();

  // 1. Fetch the wishlist
  const {
    data: wishlistItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  // 2. Add to wishlist
  const { mutate: addToWishlist, isPending: isAdding } = useMutation({
    mutationFn: apiAddToWishlist,
    onSuccess: () => {
      // Instantly refetch the wishlist so the UI updates
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // 3. Remove from wishlist
  const { mutate: removeFromWishlist, isPending: isRemoving } = useMutation({
    mutationFn: apiRemoveFromWishlist,
    onSuccess: () => {
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
