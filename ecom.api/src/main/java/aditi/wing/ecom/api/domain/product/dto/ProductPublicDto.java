package aditi.wing.ecom.api.domain.product.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Public DTO for products - excludes sensitive seller information
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductPublicDto {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
    private String imageUrl;
    private String status;
    private Instant createdAt;
    private boolean inStock;
}
