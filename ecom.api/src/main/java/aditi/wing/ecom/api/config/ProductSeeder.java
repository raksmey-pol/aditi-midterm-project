package aditi.wing.ecom.api.config;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.model.Product.ProductStatus;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;

@Component
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Product p1 = Product.builder()
                    .sellerId(UUID.fromString("ba8bdcee-db9b-4c17-806e-0f2c61058b8b"))
                    .name("Wireless Mouse")
                    .imageUrl("https://placehold.net/600x600.png")
                    .description("Ergonomic wireless mouse with 2-year battery life")
                    .price(new BigDecimal("29.99"))
                    .stockQuantity(100)
                    .category("Electronics")
                    .status(ProductStatus.ACTIVE)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            Product p2 = Product.builder()
                    .sellerId(UUID.fromString("ba8bdcee-db9b-4c17-806e-0f2c61058b8b"))
                    .name("Mechanical Keyboard")
                    .imageUrl("https://placehold.net/600x600.png")
                    .description("RGB backlit mechanical keyboard with blue switches")
                    .price(new BigDecimal("79.99"))
                    .stockQuantity(50)
                    .category("Electronics")
                    .status(ProductStatus.ACTIVE)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            Product p3 = Product.builder()
                    .sellerId(UUID.fromString("ba8bdcee-db9b-4c17-806e-0f2c61058b8b"))
                    .name("Notebook")
                    .imageUrl("https://placehold.net/600x600.png")
                    .description("Hardcover notebook with 200 pages")
                    .price(new BigDecimal("9.99"))
                    .stockQuantity(200)
                    .category("Stationery")
                    .status(ProductStatus.ACTIVE)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            productRepository.saveAll(java.util.List.of(p1, p2, p3));

            System.out.println("Sample products have been seeded!");
        }
    }
}