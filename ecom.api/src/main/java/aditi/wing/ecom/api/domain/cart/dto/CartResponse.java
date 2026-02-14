package aditi.wing.ecom.api.domain.cart.dto;

import aditi.wing.ecom.api.domain.cart.model.Cart;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class CartResponse {

    private UUID cartId;
    private UUID userId;
    private List<CartItemResponse> items;
    private int totalItems;        // total units across all cart items
    private BigDecimal totalPrice; // sum of all subtotals
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CartResponse from(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());

        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        BigDecimal totalPrice = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getId())
                .items(itemResponses)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}