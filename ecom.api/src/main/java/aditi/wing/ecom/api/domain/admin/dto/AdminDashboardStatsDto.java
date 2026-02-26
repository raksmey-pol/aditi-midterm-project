package aditi.wing.ecom.api.domain.admin.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long totalSellers;
    private long totalBuyers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalCategories;
}
