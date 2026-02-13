package aditi.wing.ecom.api.domain.orders.service;

import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.mapper.OrderMapper;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Order order = orderMapper.toEntity(request);

        order.setBuyerId(user.getId());
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
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