package aditi.wing.ecom.api.domain.cart.service;

import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.cart.model.Cart;
import aditi.wing.ecom.api.domain.cart.model.CartItem;
import aditi.wing.ecom.api.domain.cart.repository.CartItemRepository;
import aditi.wing.ecom.api.domain.cart.repository.CartRepository;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Cart addToCart(UUID userId, UUID productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        // Fetch user first so we can set the relationship on Cart
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Find existing cart or create a new one
        // FIX: was returning cartRepository.save(c) early which made everything below unreachable
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(user);
                    c.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(c);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException(
                    "Not enough stock. Requested: " + quantity +
                            ", Available: " + product.getStockQuantity()
            );
        }

        cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresentOrElse(
                        existingItem -> {
                            int newQty = existingItem.getQuantity() + quantity;
                            if (product.getStockQuantity() < newQty) {
                                throw new RuntimeException(
                                        "Not enough stock for total quantity: " + newQty +
                                                ", Available: " + product.getStockQuantity()
                                );
                            }
                            existingItem.setQuantity(newQty);
                            existingItem.setUpdatedAt(LocalDateTime.now());
                            cartItemRepository.save(existingItem);
                        },
                        () -> {
                            CartItem newItem = new CartItem();
                            newItem.setCart(cart);
                            newItem.setProduct(product);
                            newItem.setQuantity(quantity);
                            newItem.setPrice(product.getPrice());
                            newItem.setCreatedAt(LocalDateTime.now());
                            newItem.setUpdatedAt(LocalDateTime.now());
                            cartItemRepository.save(newItem);
                            cart.getItems().add(newItem);
                        }
                );

        return cartRepository.save(cart);
    }
    @Override
    public Cart getCartByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public void updateQuantity(UUID cartItemId, int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));

        Product product = item.getProduct();
        if (product.getStockQuantity() < qty) {
            throw new RuntimeException(
                    "Not enough stock. Requested: " + qty +
                            ", Available: " + product.getStockQuantity()
            );
        }

        item.setQuantity(qty);
        item.setUpdatedAt(LocalDateTime.now());
        cartItemRepository.save(item);
    }

    @Override
    public void clearCart(UUID cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Cart not found with id: " + cartId);
        }
        cartItemRepository.deleteByCartId(cartId);
    }

    @Override
    public void removeItem(UUID cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("Cart item not found: " + cartItemId);
        }
        cartItemRepository.deleteById(cartItemId);
    }
}