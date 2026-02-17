package aditi.wing.ecom.api.domain.cart.service;

import aditi.wing.ecom.api.domain.cart.model.Cart;
import aditi.wing.ecom.api.domain.seller.model.Product;

import java.util.UUID;

public interface CartService {
    Cart addToCart(UUID userId,UUID productId, int quantity);

    Cart getCartByUserId(UUID userId);

    void removeItem(UUID cartItemID);

    void updateQuantity(UUID cartItemId, int quantity);

    void clearCart(UUID cartId);
}
