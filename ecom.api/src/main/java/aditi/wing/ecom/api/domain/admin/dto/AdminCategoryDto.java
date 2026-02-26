package aditi.wing.ecom.api.domain.admin.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminCategoryDto {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
