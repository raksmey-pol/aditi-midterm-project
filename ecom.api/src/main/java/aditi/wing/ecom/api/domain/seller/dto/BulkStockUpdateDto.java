package aditi.wing.ecom.api.domain.seller.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkStockUpdateDto {
    private List<StockUpdate> updates;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StockUpdate {
        private UUID productId;
        private Integer newStockQuantity;
    }
}
