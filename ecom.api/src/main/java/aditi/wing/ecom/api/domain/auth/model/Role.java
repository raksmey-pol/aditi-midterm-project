package aditi.wing.ecom.api.domain.auth.model;

import java.time.LocalDateTime;

import aditi.wing.ecom.api.common.base.IdBasedModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "roles")
public class Role extends IdBasedModel {

    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

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

    public static final String BUYER = "buyer";
    public static final String SELLER = "seller";
    public static final String ADMIN  = "admin";
}