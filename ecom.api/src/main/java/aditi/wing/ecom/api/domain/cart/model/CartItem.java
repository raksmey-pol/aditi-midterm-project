package aditi.wing.ecom.api.domain.cart.model;

import aditi.wing.ecom.api.domain.seller.model.Product;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cart_items",
        uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id","product_id"}))
@Data
public class CartItem {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private BigDecimal price;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
