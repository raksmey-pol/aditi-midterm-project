package aditi.wing.ecom.api.domain.product.controller;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import aditi.wing.ecom.api.domain.product.dto.ProductPublicDto;
import aditi.wing.ecom.api.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Get all products with pagination and filtering
     * GET /api/products
     * 
     * Query Parameters:
     * - page: Page number (default: 0)
     * - size: Page size (default: 20)
     * - search: Search term for product name/description
     * - category: Filter by category
     * - minPrice: Minimum price
     * - maxPrice: Maximum price
     * - sortBy: Sort field (default: createdAt)
     * - sortDir: Sort direction (asc/desc, default: desc)
     */
    @GetMapping
    public ResponseEntity<Page<ProductPublicDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            // Validate page size
            if (size > 100) {
                size = 100; // Max 100 items per page
            }
            if (size < 1) {
                size = 20;
            }
            if (page < 0) {
                page = 0;
            }

            // Create sort
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

            // Create pageable
            Pageable pageable = PageRequest.of(page, size, sort);

            // Get products with filters
            Page<ProductPublicDto> products = productService.getProducts(
                    search, category, minPrice, maxPrice, pageable);

            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        try {
            ProductPublicDto product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to retrieve product"));
        }
    }

    /**
     * Get all categories
     * GET /api/products/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            return ResponseEntity.ok(productService.getAllCategories());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to retrieve categories"));
        }
    }

    private record ErrorResponse(String message) {
    }
}
