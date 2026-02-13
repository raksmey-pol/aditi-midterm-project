package aditi.wing.ecom.api.config;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderSeeder implements CommandLineRunner {

    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Check if we already have orders to prevent duplicates on restart
        if (orderRepository.count() > 0) {
            System.out.println("Orders already seeded. Skipping...");
            return;
        }

        // 2. Use the ID from your specific Access Token
        UUID myUserId = UUID.fromString("5fc1a9b6-3ec4-4efb-a43d-986a0da8a2dc");
        UUID randomAddressId = UUID.randomUUID(); // Just a placeholder for now

        // 3. Create a list of dummy orders
        List<Order> orders = List.of(
                // Order 1: Pending, $99.99
                Order.builder()
                        .buyerId(myUserId)
                        .status(OrderStatus.PENDING)
                        .totalAmount(new BigDecimal("99.99"))
                        .shippingAddressId(randomAddressId)
                        .build(),

                // Order 2: Shipped, $250.50
                Order.builder()
                        .buyerId(myUserId)
                        .status(OrderStatus.SHIPPED)
                        .totalAmount(new BigDecimal("250.50"))
                        .shippingAddressId(randomAddressId)
                        .build(),

                // Order 3: Delivered, $12.00
                Order.builder()
                        .buyerId(myUserId)
                        .status(OrderStatus.DELIVERED)
                        .totalAmount(new BigDecimal("12.00"))
                        .shippingAddressId(randomAddressId)
                        .build(),

                // Order 4: Cancelled (maybe a mistake order)
                Order.builder()
                        .buyerId(myUserId)
                        .status(OrderStatus.CANCELLED)
                        .totalAmount(new BigDecimal("5000.00"))
                        .shippingAddressId(randomAddressId)
                        .build()
        );

        // 4. Save to Database
        orderRepository.saveAll(orders);
        System.out.println("Successfully seeded " + orders.size() + " orders for buyer: " + myUserId);
    }
}