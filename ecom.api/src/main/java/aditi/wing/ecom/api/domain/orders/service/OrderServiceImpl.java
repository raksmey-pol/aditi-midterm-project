package aditi.wing.ecom.api.domain.orders.service;

import aditi.wing.ecom.api.domain.address.model.Address;
import aditi.wing.ecom.api.domain.address.repository.AddressRepository;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.orders.dto.OrderItemRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.mapper.OrderMapper;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.model.OrderItem;
import aditi.wing.ecom.api.domain.orders.repository.OrderRepository;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional // CRITICAL: If anything fails, the database rolls back completely!
    public OrderResponse createOrder(String userEmail, OrderRequest request) {

        // 1. Verify Buyer
        User buyer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        // 2. Fetch and Verify Address
        Address address = addressRepository.findById(request.shippingAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));

        if (!address.getUser().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You can only ship to your own saved addresses.");
        }

        // 3. Initialize Order
        Order order = new Order();
        order.setBuyerId(buyer.getId());
        order.setStatus(OrderStatus.PENDING);

        String addressSnapshot = String.format("%s, %s, %s, %s, %s %s",
                address.getRecipientName(),
                address.getPhoneNumber(),
                address.getStreet1(),
                address.getCity(),
                address.getState(),
                address.getCountry());

        order.setShippingAddress(addressSnapshot);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<Product> productsToUpdate = new ArrayList<>();

        // 4. Process Items Securely
        for (OrderItemRequest itemRequest : request.items()) {

            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemRequest.productId()));

            // Stock Check
            if (product.getStockQuantity() < itemRequest.quantity()) {
                throw new IllegalArgumentException("Insufficient stock for: " + product.getName() +
                        ". Only " + product.getStockQuantity() + " left.");
            }

            // Deduct Stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());
            productsToUpdate.add(product);

            // Build Item linking to Seller
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(product.getId());
            item.setSellerId(product.getSellerId());

            item.setProductName(product.getName());
            item.setProductImageUrl(product.getImageUrl());

            item.setQuantity(itemRequest.quantity());
            item.setPrice(product.getPrice());

            // Calculate total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            totalAmount = totalAmount.add(itemTotal);

            orderItems.add(item);
        }

        // 5. Finalize and Save
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        orderRepository.save(order);
        productRepository.saveAll(productsToUpdate);

        return orderMapper.toResponse(order);
    }

    @Override
    public OrderResponse getOrder(UUID id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Security Check: Does the Buyer ID on the order match the ID of the logged-in email?
        if (!order.getBuyerId().equals(user.getId())) {
            throw new RuntimeException("Access Denied: You do not own this order.");
        }

        return orderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByBuyer(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findAllByBuyerId(user.getId())
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(UUID id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderMapper.toResponse(orderRepository.save(order));
    }
}