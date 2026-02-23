package aditi.wing.ecom.api.domain.address.dto;
import java.util.UUID;

public record AddressResponse(
        UUID id,
        String label,
        String recipientName,
        String phoneNumber,
        String street1,
        String street2,
        String city,
        String state,
        String zipCode,
        String country,
        boolean isDefault
) {}
