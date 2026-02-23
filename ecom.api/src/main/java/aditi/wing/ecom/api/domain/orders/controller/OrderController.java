package aditi.wing.ecom.api.domain.orders.controller;

import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Principal principal,
            @Valid @RequestBody OrderRequest request) {

        OrderResponse newOrder = orderService.createOrder(principal.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getOrdersByBuyer(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable UUID id,
            Principal principal) {
        return ResponseEntity.ok(orderService.getOrder(id, principal.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}