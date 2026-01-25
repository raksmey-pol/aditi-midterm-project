package aditi.wing.ecom.api.domain.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.auth.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Find all active users
     */
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    java.util.List<User> findAllActiveUsers();

    /**
     * Find user by email and active status
     */
    Optional<User> findByEmailAndIsActive(String email, boolean isActive);

    /**
     * Find users by email verification status
     */
    java.util.List<User> findByEmailVerified(boolean emailVerified);

    /**
     * Find user with roles (fetch join to avoid N+1 queries)
     */
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH UserRole ur ON u.id = ur.userId WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    /**
     * Find user by ID with roles
     */
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH UserRole ur ON u.id = ur.userId WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);
}
