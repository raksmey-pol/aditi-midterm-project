package aditi.wing.ecom.api.domain.seller.service;

import java.util.List;
import java.util.UUID;

import aditi.wing.ecom.api.domain.seller.dto.BulkStockUpdateDto;
import aditi.wing.ecom.api.domain.seller.dto.DashboardStatsDto;
import aditi.wing.ecom.api.domain.seller.dto.PayoutDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductRequestDto;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;

public interface SellerService {

    // Dashboard
    DashboardStatsDto getDashboardStats(UUID sellerId);

    // Products
    ProductResponseDto createProduct(UUID sellerId, ProductRequestDto request);

    List<ProductResponseDto> getSellerProducts(UUID sellerId);

    ProductResponseDto updateProduct(UUID sellerId, UUID productId, ProductRequestDto request);

    void deleteProduct(UUID sellerId, UUID productId);

    // Inventory
    List<ProductResponseDto> getLowStockProducts(UUID sellerId);

    void bulkUpdateStock(UUID sellerId, BulkStockUpdateDto request);

    // Payouts
    List<PayoutDto> getPayouts(UUID sellerId);
}
