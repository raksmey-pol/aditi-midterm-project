package aditi.wing.ecom.api.domain.auth.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;

    private UUID roleId;
}
