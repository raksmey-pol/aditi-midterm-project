package aditi.wing.ecom.api.domain.cart.dto;

import java.util.List;
import java.util.UUID;

public record CartResponse(
        UUID id,
        UUID buyerId,
        List<CartItemResponse> items
) {}