package aditi.wing.ecom.api.domain.auth.model;

import aditi.wing.ecom.api.common.base.IdBasedModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "permissions")
public class Permission extends IdBasedModel {

    @Column(name = "name", unique = true, nullable = false, length = 100)
    private String name;

    @Column(name = "resource", nullable = false, length = 50)
    private String resource;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    // Optional: convenience constants / helpers matching the note examples in dbdiagram
    public static final String PRODUCTS_CREATE = "products.create";
    public static final String ORDERS_READ     = "orders.read";
    public static final String USERS_UPDATE    = "users.update";

    // Optional: helper method to generate name from resource + action
    public static String generateName(String resource, String action) {
        return resource + "." + action;
    }

    // Optional: lifecycle hooks if later want audit fields
    // (not present in DBML, but consistent with User/UserRole)
    /*
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    */
}