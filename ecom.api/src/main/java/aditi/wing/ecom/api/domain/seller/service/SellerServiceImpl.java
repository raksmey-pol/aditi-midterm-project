package aditi.wing.ecom.api.domain.seller.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import aditi.wing.ecom.api.domain.cart.repository.CartItemRepository;
import aditi.wing.ecom.api.domain.seller.dto.BulkStockUpdateDto;
import aditi.wing.ecom.api.domain.seller.dto.DashboardStatsDto;
import aditi.wing.ecom.api.domain.seller.dto.PayoutDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductRequestDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.model.Sale;
import aditi.wing.ecom.api.domain.seller.repository.ProductImagesRepository;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import aditi.wing.ecom.api.domain.seller.repository.ProductVariantsRepository;
import aditi.wing.ecom.api.domain.seller.repository.SaleRepository;
import aditi.wing.ecom.api.domain.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductImagesRepository productImagesRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(UUID sellerId) {
        BigDecimal totalRevenue = saleRepository.getTotalRevenue(sellerId);
        BigDecimal pendingPayouts = saleRepository.getPendingPayouts(sellerId);
        BigDecimal platformFees = saleRepository.getTotalPlatformFees(sellerId);

        Integer totalProducts = productRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).size();
        Integer lowStockCount = productRepository.countLowStockProducts(sellerId);
        Integer totalSales = saleRepository.findBySellerId(sellerId).size();

        return new DashboardStatsDto(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                pendingPayouts != null ? pendingPayouts : BigDecimal.ZERO,
                totalProducts,
                lowStockCount,
                totalSales,
                platformFees != null ? platformFees : BigDecimal.ZERO);
    }

    @Override
    @Transactional
    public ProductResponseDto createProduct(UUID sellerId, ProductRequestDto request) {
        Product product = Product.builder()
                .sellerId(sellerId)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? Product.ProductStatus.valueOf(request.getStatus())
                        : Product.ProductStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getSellerProducts(UUID sellerId) {
        return productRepository.findBySellerIdOrderByCreatedAtDesc(sellerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(UUID sellerId, UUID productId, ProductRequestDto request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) {
            product.setStatus(Product.ProductStatus.valueOf(request.getStatus()));
        }
        product.setUpdatedAt(Instant.now());

        Product updated = productRepository.save(product);
        return toDto(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID sellerId, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized to delete this product");
        }

        // Remove dependent records that have FK constraints on products
        cartItemRepository.deleteByProduct_Id(productId);
        wishlistItemRepository.deleteByProduct_Id(productId);
        productVariantsRepository.deleteByProduct_Id(productId);
        productImagesRepository.deleteByProduct_Id(productId);

        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getLowStockProducts(UUID sellerId) {
        return productRepository.findLowStockProducts(sellerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void bulkUpdateStock(UUID sellerId, BulkStockUpdateDto request) {
        for (BulkStockUpdateDto.StockUpdate update : request.getUpdates()) {
            Product product = productRepository.findById(update.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + update.getProductId()));

            if (!product.getSellerId().equals(sellerId)) {
                throw new RuntimeException("Unauthorized to update product: " + update.getProductId());
            }

            product.setStockQuantity(update.getNewStockQuantity());
            product.setUpdatedAt(Instant.now());

            // Auto-update status based on stock
            if (update.getNewStockQuantity() == 0) {
                product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
            } else if (product.getStatus() == Product.ProductStatus.OUT_OF_STOCK) {
                product.setStatus(Product.ProductStatus.ACTIVE);
            }

            productRepository.save(product);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayoutDto> getPayouts(UUID sellerId) {
        List<Sale> sales = saleRepository.findBySellerId(sellerId);

        return sales.stream().map(sale -> {
            Product product = productRepository.findById(sale.getProductId()).orElse(null);

            return new PayoutDto(
                    sale.getId(),
                    sale.getProductId(),
                    product != null ? product.getName() : "Unknown Product",
                    sale.getQuantity(),
                    sale.getTotalAmount(),
                    sale.getPlatformFee(),
                    sale.getSellerEarnings(),
                    sale.getPayoutStatus().name(),
                    sale.getSaleDate());
        }).collect(Collectors.toList());
    }

    private ProductResponseDto toDto(Product product) {
        return new ProductResponseDto(
                product.getId(),
                product.getSellerId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory(),
                product.getImageUrl(),
                product.getStatus().name(),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
