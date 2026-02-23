package aditi.wing.ecom.api.domain.address.dto;
import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank(message = "Label is required") String label,
        @NotBlank(message = "Recipient name is required") String recipientName,
        @NotBlank(message = "Phone number is required") String phoneNumber,
        @NotBlank(message = "Street address is required") String street1,
        String street2,
        @NotBlank(message = "City is required") String city,
        @NotBlank(message = "State is required") String state,
        String zipCode,
        @NotBlank(message = "Country is required") String country,
        boolean isDefault
) {}
