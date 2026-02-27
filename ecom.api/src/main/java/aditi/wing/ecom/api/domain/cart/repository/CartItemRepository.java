package aditi.wing.ecom.api.domain.cart.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import aditi.wing.ecom.api.domain.cart.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartIdAndProductId(UUID id, UUID product);

    void deleteByCartId(UUID cartId);

    void deleteByProduct_Id(UUID productId);
}
