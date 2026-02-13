package aditi.wing.ecom.api.domain.orders.service;

import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request, String userEmail);
    OrderResponse getOrder(UUID id, String userEmail);
    List<OrderResponse> getOrdersByBuyer(String userEmail);
    OrderResponse updateStatus(UUID id, OrderStatus status);
}