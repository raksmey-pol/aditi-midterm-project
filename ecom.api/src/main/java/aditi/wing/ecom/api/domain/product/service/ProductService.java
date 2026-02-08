package aditi.wing.ecom.api.domain.product.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import aditi.wing.ecom.api.domain.product.dto.ProductPublicDto;

public interface ProductService {

    /**
     * Get all products with pagination and filtering
     */
    Page<ProductPublicDto> getProducts(
            String search,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable);

    /**
     * Get product by ID
     */
    ProductPublicDto getProductById(String id);

    /**
     * Get all available categories
     */
    List<String> getAllCategories();
}
