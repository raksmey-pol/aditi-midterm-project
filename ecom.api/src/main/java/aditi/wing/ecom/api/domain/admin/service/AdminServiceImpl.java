package aditi.wing.ecom.api.domain.admin.service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import aditi.wing.ecom.api.domain.admin.dto.AdminCategoryDto;
import aditi.wing.ecom.api.domain.admin.dto.AdminDashboardStatsDto;
import aditi.wing.ecom.api.domain.admin.dto.AdminUserDto;
import aditi.wing.ecom.api.domain.admin.model.Category;
import aditi.wing.ecom.api.domain.admin.repository.CategoryRepository;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.RoleRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRoleRepository;
import aditi.wing.ecom.api.domain.orders.dto.OrderResponse;
import aditi.wing.ecom.api.domain.orders.enums.OrderStatus;
import aditi.wing.ecom.api.domain.orders.mapper.OrderMapper;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.repository.OrderRepository;
import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import aditi.wing.ecom.api.domain.seller.repository.ProductRepository;
import aditi.wing.ecom.api.domain.seller.repository.SaleRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CategoryRepository categoryRepository;
    private final SaleRepository saleRepository;

    // ── Dashboard ─────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();

        UUID sellerRoleId = roleRepository.findByName("seller")
                .map(r -> r.getId())
                .orElse(null);
        UUID buyerRoleId = roleRepository.findByName("buyer")
                .map(r -> r.getId())
                .orElse(null);

        long totalSellers = sellerRoleId != null ? userRoleRepository.findByRoleId(sellerRoleId).size() : 0;
        long totalBuyers = buyerRoleId != null ? userRoleRepository.findByRoleId(buyerRoleId).size() : 0;

        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalCategories = categoryRepository.count();

        BigDecimal totalRevenue = saleRepository.findAll()
                .stream()
                .map(s -> s.getSellerEarnings() != null ? s.getSellerEarnings() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardStatsDto(
                totalUsers, totalSellers, totalBuyers,
                totalProducts, totalOrders, totalRevenue, totalCategories);
    }

    // ── User management ───────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toAdminUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminUserDto setUserStatus(UUID userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setActive(active);
        return toAdminUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }
        userRoleRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    // ── Product management ────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toProductDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProduct(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found: " + productId);
        }
        productRepository.deleteById(productId);
    }

    // ── Order management ──────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    // ── Category management ───────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<AdminCategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toCategoryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminCategoryDto createCategory(AdminCategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Category already exists: " + dto.getName());
        }
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toCategoryDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public AdminCategoryDto updateCategory(UUID id, AdminCategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        return toCategoryDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // ── Mappers ───────────────────────────────────────────────────

    private AdminUserDto toAdminUserDto(User user) {
        List<String> roleNames = userRoleRepository.findRoleNamesByUserId(user.getId());
        AdminUserDto dto = new AdminUserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setActive(user.isActive());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRoles(new HashSet<>(roleNames));
        return dto;
    }

    private ProductResponseDto toProductDto(Product p) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(p.getId());
        dto.setSellerId(p.getSellerId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStockQuantity(p.getStockQuantity());
        dto.setCategory(p.getCategory());
        dto.setImageUrl(p.getImageUrl());
        dto.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    private AdminCategoryDto toCategoryDto(Category c) {
        return AdminCategoryDto.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
