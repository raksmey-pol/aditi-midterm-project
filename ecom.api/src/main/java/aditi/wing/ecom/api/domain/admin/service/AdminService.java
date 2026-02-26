package aditi.wing.ecom.api.domain.admin.service;

import java.util.List;
import java.util.UUID;

import aditi.wing.ecom.api.domain.admin.dto.AdminCategoryDto;
import aditi.wing.ecom.api.domain.admin.dto.AdminDashboardStatsDto;
import aditi.wing.ecom.api.domain.admin.dto.AdminUserDto;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;

public interface AdminService {

    /** Platform-wide dashboard statistics */
    AdminDashboardStatsDto getDashboardStats();

    /** User management */
    List<AdminUserDto> getAllUsers();

    AdminUserDto setUserStatus(UUID userId, boolean active);

    void deleteUser(UUID userId);

    /** Product management */
    List<ProductResponseDto> getAllProducts();

    void deleteProduct(UUID productId);

    /** Order management */
    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(UUID orderId, OrderStatus status);

    /** Category management */
    List<AdminCategoryDto> getAllCategories();

    AdminCategoryDto createCategory(AdminCategoryDto dto);

    AdminCategoryDto updateCategory(UUID id, AdminCategoryDto dto);

    void deleteCategory(UUID id);
}
