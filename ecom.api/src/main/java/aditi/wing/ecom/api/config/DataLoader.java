package aditi.wing.ecom.api.config;

import java.util.ArrayList;
import java.util.List;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import aditi.wing.ecom.api.domain.auth.model.Permission;
import aditi.wing.ecom.api.domain.auth.model.Role;
import aditi.wing.ecom.api.domain.auth.model.RolePermission;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.model.UserRole;
import aditi.wing.ecom.api.domain.admin.model.Category;
import aditi.wing.ecom.api.domain.auth.repository.PermissionRepository;
import aditi.wing.ecom.api.domain.auth.repository.RolePermissionRepository;
import aditi.wing.ecom.api.domain.auth.repository.RoleRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRoleRepository;
import aditi.wing.ecom.api.domain.admin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting RBAC data seeding...");

        // Seed Roles
        seedRoles();

        // Seed Permissions
        seedPermissions();

        // Assign Permissions to Roles
        assignPermissionsToRoles();

        // Seed Users (Admin, Seller, Buyer)
        seedUsers();
        // Seed Categories
        seedCategories();
        log.info("RBAC data seeding completed successfully!");
    }

    private void seedRoles() {
        if (roleRepository.count() > 0) {
            log.info("Roles already exist, skipping role seeding");
            return;
        }

        List<Role> roles = List.of(
                Role.builder()
                        .name(Role.BUYER)
                        .description("Regular customer who can browse and purchase products")
                        .build(),
                Role.builder()
                        .name(Role.SELLER)
                        .description("Vendor who can manage their products and orders")
                        .build(),
                Role.builder()
                        .name(Role.ADMIN)
                        .description("Administrator with full system access")
                        .build());

        roleRepository.saveAll(roles);
        log.info("Seeded {} roles", roles.size());
    }

    private void seedPermissions() {
        if (permissionRepository.count() > 0) {
            log.info("Permissions already exist, skipping permission seeding");
            return;
        }

        List<Permission> permissions = new ArrayList<>();

        // Product permissions
        permissions.add(createPermission("products", "read", "View product listings"));
        permissions.add(createPermission("products", "create", "Create new products"));
        permissions.add(createPermission("products", "update", "Update product details"));
        permissions.add(createPermission("products", "delete", "Delete products"));

        // Order permissions
        permissions.add(createPermission("orders", "read", "View orders"));
        permissions.add(createPermission("orders", "create", "Place new orders"));
        permissions.add(createPermission("orders", "update", "Update order status"));
        permissions.add(createPermission("orders", "cancel", "Cancel orders"));

        // User permissions
        permissions.add(createPermission("users", "read", "View user profiles"));
        permissions.add(createPermission("users", "update", "Update user information"));
        permissions.add(createPermission("users", "delete", "Delete users"));
        permissions.add(createPermission("users", "manage", "Full user management"));

        // Category permissions
        permissions.add(createPermission("categories", "read", "View categories"));
        permissions.add(createPermission("categories", "create", "Create categories"));
        permissions.add(createPermission("categories", "update", "Update categories"));
        permissions.add(createPermission("categories", "delete", "Delete categories"));

        // Review permissions
        permissions.add(createPermission("reviews", "read", "View reviews"));
        permissions.add(createPermission("reviews", "create", "Write reviews"));
        permissions.add(createPermission("reviews", "update", "Edit own reviews"));
        permissions.add(createPermission("reviews", "delete", "Delete reviews"));

        // Cart permissions
        permissions.add(createPermission("cart", "read", "View cart"));
        permissions.add(createPermission("cart", "update", "Modify cart items"));

        // Payment permissions
        permissions.add(createPermission("payments", "read", "View payment history"));
        permissions.add(createPermission("payments", "process", "Process payments"));

        // Analytics permissions
        permissions.add(createPermission("analytics", "read", "View analytics and reports"));

        permissionRepository.saveAll(permissions);
        log.info("Seeded {} permissions", permissions.size());
    }

    private Permission createPermission(String resource, String action, String description) {
        return Permission.builder()
                .name(Permission.generateName(resource, action))
                .resource(resource)
                .action(action)
                .description(description)
                .build();
    }

    private void assignPermissionsToRoles() {
        if (rolePermissionRepository.count() > 0) {
            log.info("Role-Permission assignments already exist, skipping");
            return;
        }

        Role buyer = roleRepository.findByName(Role.BUYER)
                .orElseThrow(() -> new RuntimeException("Buyer role not found"));
        Role seller = roleRepository.findByName(Role.SELLER)
                .orElseThrow(() -> new RuntimeException("Seller role not found"));
        Role admin = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        List<RolePermission> assignments = new ArrayList<>();

        // BUYER permissions
        assignments.addAll(assignPermissionsByName(buyer, List.of(
                "products.read",
                "orders.read",
                "orders.create",
                "orders.cancel",
                "users.read",
                "users.update",
                "categories.read",
                "reviews.read",
                "reviews.create",
                "reviews.update",
                "cart.read",
                "cart.update",
                "payments.read",
                "payments.process")));

        // SELLER permissions (all buyer permissions + product management)
        assignments.addAll(assignPermissionsByName(seller, List.of(
                "products.read",
                "products.create",
                "products.update",
                "products.delete",
                "orders.read",
                "orders.update",
                "users.read",
                "users.update",
                "categories.read",
                "reviews.read",
                "analytics.read")));

        // ADMIN permissions (all permissions)
        List<Permission> allPermissions = permissionRepository.findAll();
        for (Permission permission : allPermissions) {
            assignments.add(RolePermission.of(admin.getId(), permission.getId()));
        }

        rolePermissionRepository.saveAll(assignments);
        log.info("Assigned {} role-permission mappings", assignments.size());
    }

    private List<RolePermission> assignPermissionsByName(Role role, List<String> permissionNames) {
        List<RolePermission> assignments = new ArrayList<>();
        for (String permissionName : permissionNames) {
            Permission permission = permissionRepository.findByName(permissionName)
                    .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));
            assignments.add(RolePermission.of(role.getId(), permission.getId()));
        }
        return assignments;
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already exist, skipping user seeding");
            return;
        }

        // Get roles
        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
        Role sellerRole = roleRepository.findByName(Role.SELLER)
                .orElseThrow(() -> new RuntimeException("Seller role not found"));
        Role buyerRole = roleRepository.findByName(Role.BUYER)
                .orElseThrow(() -> new RuntimeException("Buyer role not found"));

        // Create admin user
        User admin = User.builder()
                .email("admin@ecom.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .firstName("Admin")
                .lastName("User")
                .phone("+1234567890")
                .isActive(true)
                .emailVerified(true)
                .build();
        User savedAdmin = userRepository.save(admin);
        userRoleRepository.save(UserRole.builder()
                .userId(savedAdmin.getId())
                .roleId(adminRole.getId())
                .build());
        log.info("Created admin user: {}", savedAdmin.getEmail());

        // Create seller user
        User seller = User.builder()
                .email("seller@ecom.com")
                .passwordHash(passwordEncoder.encode("Seller@123"))
                .firstName("Seller")
                .lastName("User")
                .address("Los Angeles")
                .phone("+1234567891")
                .isActive(true)
                .emailVerified(true)
                .build();
        User savedSeller = userRepository.save(seller);
        userRoleRepository.save(UserRole.builder()
                .userId(savedSeller.getId())
                .roleId(sellerRole.getId())
                .build());
        log.info("Created seller user: {}", savedSeller.getEmail());

        // Create buyer user
        User buyer = User.builder()
                .email("buyer@ecom.com")
                .passwordHash(passwordEncoder.encode("Buyer@123"))
                .firstName("Buyer")
                .lastName("User")
                .address("Los Angeles")
                .phone("+1234567892")
                .isActive(true)
                .emailVerified(true)
                .build();
        User savedBuyer = userRepository.save(buyer);
        userRoleRepository.save(UserRole.builder()
                .userId(savedBuyer.getId())
                .roleId(buyerRole.getId())
                .build());
        log.info("Created buyer user: {}", savedBuyer.getEmail());

        log.info("Successfully seeded 3 users (admin, seller, buyer)");
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            log.info("Categories already exist, skipping category seeding");
            return;
        }

        List<Category> categories = List.of(
                Category.builder().name("Electronics").build(),
                Category.builder().name("Clothing & Apparel").build(),
                Category.builder().name("Home & Garden").build(),
                Category.builder().name("Sports & Outdoors").build(),
                Category.builder().name("Books & Media").build(),
                Category.builder().name("Toys & Games").build(),
                Category.builder().name("Beauty & Personal Care").build(),
                Category.builder().name("Automotive").build(),
                Category.builder().name("Food & Grocery").build(),
                Category.builder().name("Health & Wellness").build(),
                Category.builder().name("Other").build()
        );

        categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", categories.size());
    }
}
