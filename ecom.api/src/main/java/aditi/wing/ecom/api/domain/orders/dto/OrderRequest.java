package aditi.wing.ecom.api.domain.orders.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderRequest(
        UUID userId, BigDecimal totalAmount,
        UUID shippingAddressId,
        List<OrderItemRequest> items
) {}

