package aditi.wing.ecom.api.domain.auth.model;

import java.util.UUID;

import aditi.wing.ecom.api.common.base.IdBasedModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "role_permissions")
public class RolePermission extends IdBasedModel {

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "permission_id", nullable = false)
    private UUID permissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", insertable = false, updatable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", insertable = false, updatable = false)
    private Permission permission;

    // Optional: convenience factory method
    public static RolePermission of(UUID roleId, UUID permissionId) {
        return RolePermission.builder()
                .roleId(roleId)
                .permissionId(permissionId)
                .build();
    }

    // Optional: if ever want to add audit fields later (consistent with User)
    /*
     * @Column(name = "assigned_at", nullable = false, updatable = false)
     * private LocalDateTime assignedAt;
     * 
     * @PrePersist
     * protected void onCreate() {
     * this.assignedAt = LocalDateTime.now();
     * }
     */
}