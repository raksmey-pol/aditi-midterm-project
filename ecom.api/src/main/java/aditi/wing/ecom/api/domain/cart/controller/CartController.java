package aditi.wing.ecom.api.domain.cart.controller;

import aditi.wing.ecom.api.domain.cart.dto.AddToCartRequest;
import aditi.wing.ecom.api.domain.cart.dto.CartResponse;
import aditi.wing.ecom.api.domain.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 1. Get the current user's cart
    @GetMapping
    public ResponseEntity<CartResponse> getMyCart(Principal principal) {
        // principal.getName() extracts the email securely from the JWT
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    // 2. Add an item to the cart (or increase quantity)
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request, // @Valid triggers your @NotNull and @Min rules!
            Principal principal) {
        return ResponseEntity.ok(cartService.addToCart(request, principal.getName()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @PathVariable UUID itemId,
            Principal principal) {
        return ResponseEntity.ok(cartService.removeItemFromCart(itemId, principal.getName()));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
