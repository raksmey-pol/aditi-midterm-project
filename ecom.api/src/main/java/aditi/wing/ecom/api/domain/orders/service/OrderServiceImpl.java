package aditi.wing.ecom.api.domain.orders.service;

import aditi.wing.ecom.api.domain.address.model.Address;
import aditi.wing.ecom.api.domain.address.repository.AddressRepository;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.cart.model.Cart;
import aditi.wing.ecom.api.domain.cart.model.CartItem;
import aditi.wing.ecom.api.domain.cart.repository.CartRepository;
import aditi.wing.ecom.api.domain.orders.dto.OrderItemRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.dto.PlaceOrderRequest;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.mapper.OrderMapper;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.model.OrderItem;
import aditi.wing.ecom.api.domain.orders.repository.OrderRepository;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
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

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponse placeOrder(User user, PlaceOrderRequest request) {

        Address address = addressRepository.findByIdAndUser(request.shippingAddressId(), user)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        Cart cart = cartRepository.findByUserWithItems(user)
                .orElseThrow(() -> new EntityNotFoundException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place order with empty cart");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException(
                        "Insufficient stock for product: " + product.getName()
                );
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
            }
            productRepository.save(product);

            OrderItemRequest itemRequest = new OrderItemRequest(
                    product.getId(),
                    product.getSellerId(),
                    product.getName(),
                    product.getImageUrl(),
                    cartItem.getQuantity(),
                    cartItem.getPrice()
            );

            orderItems.add(orderMapper.toItemEntity(itemRequest));
            total = total.add(cartItem.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // ← use formatted string instead of UUID
        OrderRequest orderRequest = new OrderRequest(
                total,
                formatAddress(address),
                orderItems.stream()
                        .map(item -> new OrderItemRequest(
                                item.getProductId(),
                                item.getSellerId(),
                                item.getProductName(),
                                item.getProductImageUrl(),
                                item.getQuantity(),
                                item.getPrice()
                        ))
                        .toList()
        );

        Order order = orderMapper.toEntity(orderRequest);
        order.setBuyerId(user.getId());
        Order savedOrder = orderRepository.saveAndFlush(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toResponse(savedOrder);
    }

    private String formatAddress(Address address) {
        StringBuilder sb = new StringBuilder();
        sb.append(address.getRecipientName()).append(", ");
        sb.append(address.getPhoneNumber()).append(", ");
        sb.append(address.getStreet1());
        if (address.getStreet2() != null && !address.getStreet2().isBlank()) {
            sb.append(", ").append(address.getStreet2());
        }
        sb.append(", ").append(address.getCity());
        sb.append(", ").append(address.getState());
        if (address.getZipCode() != null && !address.getZipCode().isBlank()) {
            sb.append(" ").append(address.getZipCode());
        }
        sb.append(", ").append(address.getCountry());
        return sb.toString();
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