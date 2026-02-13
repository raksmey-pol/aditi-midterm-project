package aditi.wing.ecom.api.domain.orders.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemRequest(
        UUID productId,
        UUID sellerId,
        String productName,
        int quantity,
        BigDecimal price
) {}
