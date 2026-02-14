package aditi.wing.ecom.api.domain.orders.controller;

import aditi.wing.ecom.api.domain.orders.dto.OrderRequest;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
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
            @RequestBody OrderRequest request,
            Principal principal) {
        // principal.getName() is the email string from your filter
        return ResponseEntity.ok(orderService.createOrder(request, principal.getName()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Principal principal) {
        // Gets all orders belonging to the logged-in email
        return ResponseEntity.ok(orderService.getOrdersByBuyer(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable UUID id,
            Principal principal) {
        // Service will check if this email owns order {id}
        return ResponseEntity.ok(orderService.getOrder(id, principal.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {
        // Status updates usually don't require the buyer's email (Admin/Seller action)
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}