package aditi.wing.ecom.api.domain.orders.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID id,             // The unique ID of the line item
        UUID productId,
        UUID sellerId,
        String productName,
        int quantity,
        BigDecimal price,    // Unit price
        String status
) {}
