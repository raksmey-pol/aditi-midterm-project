package aditi.wing.ecom.api.domain.seller.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import aditi.wing.ecom.api.common.base.IdBasedModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale extends IdBasedModel {

    @Column(name = "seller_id", nullable = false)
    private UUID sellerId;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "buyer_id", nullable = false)
    private UUID buyerId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "platform_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(name = "seller_earnings", nullable = false, precision = 10, scale = 2)
    private BigDecimal sellerEarnings;

    @Enumerated(EnumType.STRING)
    @Column(name = "payout_status", nullable = false, length = 20)
    private PayoutStatus payoutStatus = PayoutStatus.PENDING;

    @Column(name = "sale_date", nullable = false)
    private Instant saleDate = Instant.now();

    public enum PayoutStatus {
        PENDING,
        PROCESSING,
        PAID,
        FAILED
    }
}
