package aditi.wing.ecom.api.domain.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.auth.model.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    /**
     * Find permission by name (e.g., "products.create")
     */
    Optional<Permission> findByName(String name);

    /**
     * Find permissions by resource (e.g., "products")
     */
    List<Permission> findByResource(String resource);

    /**
     * Find permissions by action (e.g., "create")
     */
    List<Permission> findByAction(String action);

    /**
     * Find permission by resource and action
     */
    Optional<Permission> findByResourceAndAction(String resource, String action);

    /**
     * Check if permission exists by name
     */
    boolean existsByName(String name);

    /**
     * Find all permissions for a specific role
     */
    @Query("SELECT p FROM Permission p JOIN RolePermission rp ON p.id = rp.permissionId WHERE rp.roleId = :roleId")
    List<Permission> findByRoleId(@Param("roleId") UUID roleId);
}
