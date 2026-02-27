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

  // Only fetch when the user is authenticated – avoids 403 for guests
  const {
    data: wishlistItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: isLoggedIn,
  });

  // 2. Add to wishlist
  const { mutate: addToWishlist, isPending: isAdding } = useMutation({
    mutationFn: apiAddToWishlist,
    onSuccess: () => {
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
