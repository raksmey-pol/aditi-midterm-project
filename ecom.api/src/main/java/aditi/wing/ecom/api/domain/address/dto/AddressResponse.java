package aditi.wing.ecom.api.domain.address.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AddressResponse(
        UUID id,
        UUID userId,
        String addressType,
        String fullName,
        String phone,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode,
        String country,
        boolean isDefault,
        LocalDateTime createdAt
) {}