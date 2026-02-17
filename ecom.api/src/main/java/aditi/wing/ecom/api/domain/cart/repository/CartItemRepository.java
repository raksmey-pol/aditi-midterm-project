package aditi.wing.ecom.api.domain.cart.repository;

import aditi.wing.ecom.api.domain.cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartIdAndProductId(UUID id, UUID product);
    void deleteByCartId(UUID cartId);
}
