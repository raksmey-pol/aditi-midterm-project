package aditi.wing.ecom.api.domain.wishlist.service;

import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import aditi.wing.ecom.api.domain.wishlist.mapper.ProductMapper;
import aditi.wing.ecom.api.domain.wishlist.model.WishlistItem;
import aditi.wing.ecom.api.domain.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService{

    private final WishlistItemRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public void addToWishlist(String email, UUID productId) {
        if (wishlistRepository.existsByUser_EmailAndProduct_Id(email, productId)) {
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(item);
    }

    @Override
    @Transactional
    public void removeFromWishlist(String email, UUID productId) {
        WishlistItem item = wishlistRepository.findByUser_EmailAndProduct_Id(email, productId)
                .orElseThrow(() -> new RuntimeException("Item not found in wishlist"));

        wishlistRepository.delete(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getUserWishlist(String email) {
        List<Product> products = wishlistRepository.findByUser_Email(email)
                .stream()
                .map(WishlistItem::getProduct)
                .collect(Collectors.toList());

        return productMapper.toProductResponseDtoList(products);
    }
}
