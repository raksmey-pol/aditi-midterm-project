package aditi.wing.ecom.api.domain.seller.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayoutDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal totalAmount;
    private BigDecimal platformFee;
    private BigDecimal sellerEarnings;
    private String payoutStatus;
    private Instant saleDate;
}
