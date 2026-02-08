package aditi.wing.ecom.api.domain.seller.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private BigDecimal pendingPayouts;
    private Integer totalProducts;
    private Integer lowStockCount;
    private Integer totalSales;
    private BigDecimal platformFees;
}
