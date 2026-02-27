package aditi.wing.ecom.api.domain.orders.repository;

import aditi.wing.ecom.api.domain.orders.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findAllByBuyerId(UUID buyerId);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId);
}
