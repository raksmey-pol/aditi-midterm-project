package aditi.wing.ecom.api.domain.seller.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import aditi.wing.ecom.api.common.util.JwtUtil;
import aditi.wing.ecom.api.domain.seller.dto.BulkStockUpdateDto;
import aditi.wing.ecom.api.domain.seller.dto.DashboardStatsDto;
import aditi.wing.ecom.api.domain.seller.dto.PayoutDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductRequestDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
public class SellerController {

    private final SellerService sellerService;
    private final JwtUtil jwtUtil;

    /**
     * Get dashboard statistics
     * GET /api/seller/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(request);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            DashboardStatsDto stats = sellerService.getDashboardStats(sellerId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Create new product
     * POST /api/seller/products
     */
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @RequestBody ProductRequestDto request,
            HttpServletRequest httpRequest) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(httpRequest);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            ProductResponseDto product = sellerService.createProduct(sellerId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get all seller products
     * GET /api/seller/products
     */
    @GetMapping("/products")
    public ResponseEntity<?> getProducts(HttpServletRequest request) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(request);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            List<ProductResponseDto> products = sellerService.getSellerProducts(sellerId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Update product
     * PUT /api/seller/products/{productId}
     */
    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable UUID productId,
            @RequestBody ProductRequestDto request,
            HttpServletRequest httpRequest) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(httpRequest);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            ProductResponseDto product = sellerService.updateProduct(sellerId, productId, request);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Delete product
     * DELETE /api/seller/products/{productId}
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable UUID productId,
            HttpServletRequest request) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(request);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            sellerService.deleteProduct(sellerId, productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get low stock products
     * GET /api/seller/inventory/low-stock
     */
    @GetMapping("/inventory/low-stock")
    public ResponseEntity<?> getLowStockProducts(HttpServletRequest request) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(request);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            List<ProductResponseDto> products = sellerService.getLowStockProducts(sellerId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Bulk update stock
     * POST /api/seller/inventory/bulk-update
     */
    @PostMapping("/inventory/bulk-update")
    public ResponseEntity<?> bulkUpdateStock(
            @RequestBody BulkStockUpdateDto request,
            HttpServletRequest httpRequest) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(httpRequest);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            sellerService.bulkUpdateStock(sellerId, request);
            return ResponseEntity.ok(new SuccessResponse("Stock updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get payouts
     * GET /api/seller/payouts
     */
    @GetMapping("/payouts")
    public ResponseEntity<?> getPayouts(HttpServletRequest request) {
        try {
            UUID sellerId = jwtUtil.getUserIdFromRequest(request);
            if (sellerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Unauthorized"));
            }

            List<PayoutDto> payouts = sellerService.getPayouts(sellerId);
            return ResponseEntity.ok(payouts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Response records
    private record ErrorResponse(String message) {
    }

    private record SuccessResponse(String message) {
    }
}
