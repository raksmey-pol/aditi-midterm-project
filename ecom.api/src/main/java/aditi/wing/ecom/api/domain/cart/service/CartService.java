package aditi.wing.ecom.api.domain.cart.service;

import aditi.wing.ecom.api.domain.cart.dto.AddToCartRequest;
import aditi.wing.ecom.api.domain.cart.dto.CartResponse;

import java.util.UUID;

public interface CartService {

    // Add an item (or increase its quantity if it already exists)
    CartResponse addToCart(AddToCartRequest request, String userEmail);

    // Get the current user's cart
    CartResponse getCart(String userEmail);

    // Remove a specific item from the cart
    CartResponse removeItemFromCart(UUID itemId, String userEmail);

    // Empty the cart entirely (useful after checkout)
    void clearCart(String userEmail);
}