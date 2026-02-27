package aditi.wing.ecom.api.domain.address.repository;

import aditi.wing.ecom.api.domain.address.model.Address;
import aditi.wing.ecom.api.domain.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    boolean existsByUserAndLabelIgnoreCase(User user, String label);

    List<Address> findByUser(User user);

    long countByUser(User user);

    Optional<Address> findByIdAndUser(UUID id, User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true) // ← add both
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void removeDefaultStatusForUser(@Param("userId") UUID userId);
}
