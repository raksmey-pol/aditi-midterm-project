package aditi.wing.ecom.api.domain.wishlist.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.wishlist.model.WishlistItem;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {

    List<WishlistItem> findByUser_Email(String email);

    Optional<WishlistItem> findByUser_EmailAndProduct_Id(String email, UUID productId);

    boolean existsByUser_EmailAndProduct_Id(String email, UUID productId);

    void deleteByProduct_Id(UUID productId);
}