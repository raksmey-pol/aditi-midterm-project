package aditi.wing.ecom.api.domain.seller.model;

import aditi.wing.ecom.api.common.base.IdBasedModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import tools.jackson.databind.JsonNode;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariants extends IdBasedModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "sku", nullable = false, length = 100, unique = true)
    private String sku;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "attribute", columnDefinition = "jsonb")
    private JsonNode attribute;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
}
