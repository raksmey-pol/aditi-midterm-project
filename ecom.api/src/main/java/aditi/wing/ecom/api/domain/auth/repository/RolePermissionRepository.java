package aditi.wing.ecom.api.domain.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.auth.model.RolePermission;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, UUID> {

    /**
     * Find all permissions for a role
     */
    List<RolePermission> findByRoleId(UUID roleId);

    /**
     * Find all roles that have a specific permission
     */
    List<RolePermission> findByPermissionId(Long permissionId);

    /**
     * Find specific role-permission assignment
     */
    Optional<RolePermission> findByRoleIdAndPermissionId(UUID roleId, Long permissionId);

    /**
     * Check if role has a specific permission
     */
    boolean existsByRoleIdAndPermissionId(UUID roleId, Long permissionId);

    /**
     * Delete all permissions for a role
     */
    void deleteByRoleId(UUID roleId);

    /**
     * Delete specific role-permission assignment
     */
    void deleteByRoleIdAndPermissionId(UUID roleId, Long permissionId);

    /**
     * Get permission names for a role
     */
    @Query("SELECT p.name FROM RolePermission rp JOIN Permission p ON rp.permissionId = p.id WHERE rp.roleId = :roleId")
    List<String> findPermissionNamesByRoleId(@Param("roleId") UUID roleId);
}
