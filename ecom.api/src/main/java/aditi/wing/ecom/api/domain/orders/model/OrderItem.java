package aditi.wing.ecom.api.domain.orders.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items", indexes = {
        @Index(name = "idx_item_seller", columnList = "seller_id"),
        @Index(name = "idx_item_order", columnList = "order_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private UUID productId;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false)
    private String productName;

    @Column(name = "image_url")
    private String productImageUrl;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Unit Price

    @Column(length = 50)
    private String status = "PENDING";
}