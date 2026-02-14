package aditi.wing.ecom.api.domain.cart.service;

import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.cart.dto.AddToCartRequest;
import aditi.wing.ecom.api.domain.cart.dto.CartResponse;
import aditi.wing.ecom.api.domain.cart.model.Cart;
import aditi.wing.ecom.api.domain.cart.model.CartItem;
import aditi.wing.ecom.api.domain.cart.repository.CartRepository;
import aditi.wing.ecom.api.domain.cart.mapper.CartMapper; // Assuming you will build a Mapper like you did for Orders
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse addToCart(AddToCartRequest request, String userEmail) {
        // 1. Find the logged-in user to get their UUID
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Fetch their existing cart, or create a brand new one
        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setBuyerId(buyer.getId());
                    return newCart;
                });

        // 3. Check if this exact product is already in their cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.productId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Product is already there, just add to the existing quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.quantity());
        } else {
            // It's a new product, create a new CartItem
            CartItem newItem = CartItem.builder()
                    .cart(cart) // CRITICAL: Link the item back to the parent cart
                    .productId(request.productId())
                    .sellerId(request.sellerId()) // Track the multi-seller relationship
                    .quantity(request.quantity())
                    .build();

            cart.getItems().add(newItem);
        }

        // 4. Save the cart (CascadeType.ALL will automatically save the items too)
        Cart savedCart = cartRepository.save(cart);

        // 5. Convert entity to DTO and return
        return cartMapper.toResponse(savedCart);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(String userEmail) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If they don't have a cart yet, just return an empty DTO rather than throwing an error
        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseGet(() -> {
                    Cart emptyCart = new Cart();
                    emptyCart.setBuyerId(buyer.getId());
                    return emptyCart;
                });

        return cartMapper.toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItemFromCart(UUID itemId, String userEmail) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Use removeIf to easily delete the item matching the ID
        cart.getItems().removeIf(item -> item.getId().equals(itemId));

        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toResponse(savedCart);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByBuyerId(buyer.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear(); // This deletes all items because of orphanRemoval=true
        cartRepository.save(cart);
    }
}
