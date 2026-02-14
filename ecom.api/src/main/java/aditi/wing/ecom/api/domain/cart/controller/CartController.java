package aditi.wing.ecom.api.domain.cart.controller;

import aditi.wing.ecom.api.domain.cart.dto.AddToCartRequest;
import aditi.wing.ecom.api.domain.cart.dto.CartResponse;
import aditi.wing.ecom.api.domain.cart.dto.UpdateCartItemRequest;
import aditi.wing.ecom.api.domain.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(CartController.BASE_URL)
@RequiredArgsConstructor
@Validated
public class CartController {

    public static final String BASE_URL = "/api/v1/carts";

    private final CartService cartService;

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @PathVariable UUID userId,
            @Valid @RequestBody AddToCartRequest request) {

        CartResponse response = CartResponse.from(
                cartService.addToCart(userId, request.getProductId(), request.getQuantity())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(
            @PathVariable UUID userId) {

        CartResponse response = CartResponse.from(
                cartService.getCartByUserId(userId)
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/items/{cartItemId}")
    public ResponseEntity<Void> updateItemQuantity(
            @PathVariable UUID cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        cartService.updateQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(@PathVariable UUID cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable UUID cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }
}