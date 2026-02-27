package aditi.wing.ecom.api.domain.orders.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID id,
        UUID productId,
        String productName,
        String productImageUrl,
        int quantity,
        BigDecimal price,
        BigDecimal subtotal
) {}
