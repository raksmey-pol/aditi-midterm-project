package aditi.wing.ecom.api.domain.orders.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PlaceOrderRequest(
        @NotNull UUID shippingAddressId
) {}