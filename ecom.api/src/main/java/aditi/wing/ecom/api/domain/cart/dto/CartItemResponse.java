package aditi.wing.ecom.api.domain.cart.dto;

import aditi.wing.ecom.api.domain.cart.model.CartItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CartItemResponse {

    private UUID cartItemId;
    private UUID productId;
    private String productName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal subtotal;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;

    public static CartItemResponse from(CartItem item) {
        return CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unitPrice(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .addedAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}