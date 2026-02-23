package aditi.wing.ecom.api.domain.product.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import aditi.wing.ecom.api.domain.product.dto.ProductPublicDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductPublicDto> getProducts(
            String search,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable) {

        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            // Only show ACTIVE products
            predicate = criteriaBuilder.and(predicate,
                    criteriaBuilder.equal(root.get("status"), Product.ProductStatus.ACTIVE));

            // Search in name and description
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate descPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")), searchPattern);
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.or(namePredicate, descPredicate));
            }

            // Filter by category
            if (category != null && !category.trim().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("category")),
                                category.toLowerCase()));
            }

            if (minPrice != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.<BigDecimal>get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.<BigDecimal>get("price"), maxPrice));
            }

            return predicate;
        };

        Page<Product> products = productRepository.findAll(spec, pageable);
        return products.map(this::toPublicDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductPublicDto getProductById(String id) {
        Product product = productRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Only return ACTIVE products
        if (product.getStatus() != Product.ProductStatus.ACTIVE) {
            throw new RuntimeException("Product not available");
        }

        return toPublicDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .filter(category -> category != null && !category.trim().isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    /**
     * Convert Product entity to public DTO
     */
    private ProductPublicDto toPublicDto(Product product) {
        return ProductPublicDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus().toString())
                .createdAt(product.getCreatedAt())
                .inStock(product.getStockQuantity() > 0)
                .build();
    }
}
