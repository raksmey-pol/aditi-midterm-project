package aditi.wing.ecom.api.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsDto {
    private long totalOrders;
    private double totalSpending;
    private long wishlistItems;
}
