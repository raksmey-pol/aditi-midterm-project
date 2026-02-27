import { apiClient, API_CONFIG } from "@/lib/api-client";

export const fetchWishlist = async () => {
  return apiClient.get(API_CONFIG.endpoints.buyer.wishlist);
};

export const addToWishlist = async (productId: string) => {
  return apiClient.post(API_CONFIG.endpoints.buyer.wishlist, { productId });
};

export const removeFromWishlist = async (productId: string) => {
  return apiClient.delete(
    `${API_CONFIG.endpoints.buyer.wishlist}/${productId}`,
  );
};
