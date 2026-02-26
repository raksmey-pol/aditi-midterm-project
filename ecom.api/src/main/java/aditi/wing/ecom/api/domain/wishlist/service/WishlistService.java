package aditi.wing.ecom.api.domain.wishlist.service;

import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

public interface WishlistService {
    void addToWishlist(String email, UUID productId);
    void removeFromWishlist(String email, UUID productId);

    List<ProductResponseDto> getUserWishlist(String email);
}
