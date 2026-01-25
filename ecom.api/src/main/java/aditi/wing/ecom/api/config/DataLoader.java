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
import aditi.wing.ecom.api.domain.auth.repository.PermissionRepository;
import aditi.wing.ecom.api.domain.auth.repository.RolePermissionRepository;
import aditi.wing.ecom.api.domain.auth.repository.RoleRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRoleRepository;
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

        // Seed Admin User
        seedAdminUser();

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

    private void seedAdminUser() {
        if (userRepository.count() > 0) {
            log.info("Users already exist, skipping admin user seeding");
            return;
        }

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
        log.info("Created admin user: {}", savedAdmin.getEmail());

        // Assign ADMIN role to the user
        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        UserRole userRole = UserRole.builder()
                .userId(savedAdmin.getId())
                .roleId(adminRole.getId())
                .build();

        userRoleRepository.save(userRole);
        log.info("Assigned ADMIN role to user: {}", savedAdmin.getEmail());
    }
}
