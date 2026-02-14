package aditi.wing.ecom.api.domain.cart.dto;

import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID productId,
        UUID sellerId,
        Integer quantity
) {}