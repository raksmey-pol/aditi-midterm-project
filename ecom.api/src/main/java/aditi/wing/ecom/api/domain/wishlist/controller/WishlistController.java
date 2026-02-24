package aditi.wing.ecom.api.domain.wishlist.controller;

import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.wishlist.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getWishlist(Principal principal) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<String> addToWishlist(
            Principal principal,
            @RequestBody Map<String, UUID> payload) {

        UUID productId = payload.get("productId");
        wishlistService.addToWishlist(principal.getName(), productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeFromWishlist(
            Principal principal,
            @PathVariable UUID productId) {

        wishlistService.removeFromWishlist(principal.getName(), productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}
