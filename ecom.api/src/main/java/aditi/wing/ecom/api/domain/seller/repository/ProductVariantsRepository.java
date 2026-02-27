package aditi.wing.ecom.api.domain.seller.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.seller.model.ProductVariants;

@Repository
public interface ProductVariantsRepository extends JpaRepository<ProductVariants, UUID> {
    void deleteByProduct_Id(UUID productId);
}
