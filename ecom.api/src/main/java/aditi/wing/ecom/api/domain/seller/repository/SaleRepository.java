package aditi.wing.ecom.api.domain.seller.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import aditi.wing.ecom.api.domain.seller.model.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    List<Sale> findBySellerId(UUID sellerId);

    @Query("SELECT SUM(s.sellerEarnings) FROM Sale s WHERE s.sellerId = :sellerId")
    BigDecimal getTotalRevenue(UUID sellerId);

    @Query("SELECT SUM(s.sellerEarnings) FROM Sale s WHERE s.sellerId = :sellerId AND s.payoutStatus = 'PENDING'")
    BigDecimal getPendingPayouts(UUID sellerId);

    @Query("SELECT SUM(s.platformFee) FROM Sale s WHERE s.sellerId = :sellerId")
    BigDecimal getTotalPlatformFees(UUID sellerId);
}
