package aditi.wing.ecom.api.domain.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.auth.model.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

    /**
     * Find all roles for a user
     */
    List<UserRole> findByUserId(UUID userId);

    /**
     * Find all users with a specific role
     */
    List<UserRole> findByRoleId(UUID roleId);

    /**
     * Find specific user-role assignment
     */
    Optional<UserRole> findByUserIdAndRoleId(UUID userId, UUID roleId);

    /**
     * Check if user has a specific role
     */
    boolean existsByUserIdAndRoleId(UUID userId, UUID roleId);

    /**
     * Delete all roles for a user
     */
    void deleteByUserId(UUID userId);

    /**
     * Delete specific user-role assignment
     */
    void deleteByUserIdAndRoleId(UUID userId, UUID roleId);

    /**
     * Get role names for a user
     */
    @Query("SELECT r.name FROM UserRole ur JOIN Role r ON ur.roleId = r.id WHERE ur.userId = :userId")
    List<String> findRoleNamesByUserId(@Param("userId") UUID userId);

    /**
     * Get all permissions for a user (through their roles)
     */
    @Query("SELECT DISTINCT p.name FROM UserRole ur " +
            "JOIN RolePermission rp ON ur.roleId = rp.roleId " +
            "JOIN Permission p ON rp.permissionId = p.id " +
            "WHERE ur.userId = :userId")
    List<String> findPermissionNamesByUserId(@Param("userId") UUID userId);
}
