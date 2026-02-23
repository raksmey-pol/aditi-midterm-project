package aditi.wing.ecom.api.domain.address.dto;

public record AddressRequest(
        String addressType,
        String fullName,
        String phone,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode,
        String country,
        boolean isDefault
) {}
