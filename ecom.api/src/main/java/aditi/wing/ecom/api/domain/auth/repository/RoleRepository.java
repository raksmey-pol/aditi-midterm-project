package aditi.wing.ecom.api.domain.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.auth.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    /**
     * Find role by name
     */
    Optional<Role> findByName(String name);

    /**
     * Check if role exists by name
     */
    boolean existsByName(String name);

    /**
     * Find role with permissions (fetch join to avoid N+1 queries)
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH RolePermission rp ON r.id = rp.roleId WHERE r.id = :id")
    Optional<Role> findByIdWithPermissions(@Param("id") UUID id);

    /**
     * Find role by name with permissions
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH RolePermission rp ON r.id = rp.roleId WHERE r.name = :name")
    Optional<Role> findByNameWithPermissions(@Param("name") String name);

    /**
     * Find all roles except admin
     */
    @Query("SELECT r FROM Role r WHERE LOWER(r.name) != 'admin'")
    List<Role> findAllExceptAdmin();
}
