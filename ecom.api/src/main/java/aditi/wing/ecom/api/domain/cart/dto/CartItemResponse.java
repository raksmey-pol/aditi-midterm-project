package aditi.wing.ecom.api.domain.cart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import aditi.wing.ecom.api.domain.cart.model.CartItem;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private UUID cartItemId;
    private UUID productId;
    private UUID sellerId;
    private String productName;
    private String imageUrl;   // ← add this
    private String category;   // ← add this
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal subtotal;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;

    public static CartItemResponse from(CartItem item) {
        return CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .sellerId(item.getProduct().getSellerId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())   // ← add this
                .category(item.getProduct().getCategory())   // ← add this
                .unitPrice(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .addedAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}