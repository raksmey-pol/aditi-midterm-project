package aditi.wing.ecom.api.domain.auth.dto;
import java.util.UUID;

import lombok.Data;

@Data
public class RoleResponseDto {
    private UUID id;
    private String name;
}
