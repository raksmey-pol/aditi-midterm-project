package aditi.wing.ecom.api.domain.auth.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String passwordHash;
}
