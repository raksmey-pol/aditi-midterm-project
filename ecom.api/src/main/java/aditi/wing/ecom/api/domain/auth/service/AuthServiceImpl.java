package aditi.wing.ecom.api.domain.auth.service;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import aditi.wing.ecom.api.domain.auth.dto.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import aditi.wing.ecom.api.common.middleware.JwtMiddleware;
import aditi.wing.ecom.api.domain.auth.mapper.RoleMapper;
import aditi.wing.ecom.api.domain.auth.mapper.UserMapper;
import aditi.wing.ecom.api.domain.auth.model.Role;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.model.UserRole;
import aditi.wing.ecom.api.domain.auth.repository.RoleRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.auth.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final JwtMiddleware jwtMiddleware;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticate user and generate tokens
     */
    @Override
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive");
        }

        // Verify password using PasswordEncoder
        if (!passwordEncoder.matches(loginRequest.getPasswordHash(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Get user roles and permissions
        var roleNames = userRoleRepository.findRoleNamesByUserId(user.getId());
        var permissionNames = userRoleRepository.findPermissionNamesByUserId(user.getId());

        // Map to DTO
        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        userDto.setRoles(new HashSet<>(roleNames));
        userDto.setPermissions(new HashSet<>(permissionNames));

        // Generate JWT tokens with email and roles
        String accessToken = jwtMiddleware.generateToken(user.getEmail(), user.getId(), userDto.getRoles());
        String refreshToken = jwtMiddleware.generateRefreshToken(user.getEmail());

        return new LoginResponseDto(accessToken, refreshToken, userDto);
    }

    /**
     * Register a new user and generate tokens
     */
    @Override
    @Transactional
    public LoginResponseDto register(RegisterRequestDto registerRequest) {
        // Validate input
        if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (registerRequest.getPasswordHash() == null || registerRequest.getPasswordHash().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Hash password using BCrypt
        String hashedPassword = passwordEncoder.encode(registerRequest.getPasswordHash());
        registerRequest.setPasswordHash(hashedPassword);

        // Map DTO to entity
        User user = userMapper.toUser(registerRequest);

        // Save user
        User savedUser = userRepository.save(user);

        // Assign role if provided, otherwise assign default "buyer" role
        UUID roleIdToAssign = registerRequest.getRoleId();
        if (roleIdToAssign == null) {
            // Assign default "buyer" role
            Role buyerRole = roleRepository.findByName(Role.BUYER)
                    .orElseThrow(() -> new RuntimeException("Default buyer role not found"));
            roleIdToAssign = buyerRole.getId();
        } else {
            // Verify the provided role exists
            roleRepository.findById(roleIdToAssign)
                    .orElseThrow(() -> new RuntimeException("Invalid role ID"));
        }

        // Create UserRole entry
        UserRole userRole = UserRole.builder()
                .userId(savedUser.getId())
                .roleId(roleIdToAssign)
                .build();
        userRoleRepository.save(userRole);

        // Get user roles and permissions
        var roleNames = userRoleRepository.findRoleNamesByUserId(savedUser.getId());
        var permissionNames = userRoleRepository.findPermissionNamesByUserId(savedUser.getId());

        // Map to response DTO
        UserResponseDto userDto = userMapper.toUserResponseDto(savedUser);
        userDto.setRoles(new HashSet<>(roleNames));
        userDto.setPermissions(new HashSet<>(permissionNames));

        // Generate JWT tokens with email and roles
        String accessToken = jwtMiddleware.generateToken(savedUser.getEmail(), savedUser.getId(), userDto.getRoles());
        String refreshToken = jwtMiddleware.generateRefreshToken(savedUser.getEmail());

        return new LoginResponseDto(accessToken, refreshToken, userDto);
    }

    /**
     * Get user by ID with roles and permissions
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var roleNames = userRoleRepository.findRoleNamesByUserId(user.getId());
        var permissionNames = userRoleRepository.findPermissionNamesByUserId(user.getId());

        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        userDto.setRoles(new HashSet<>(roleNames));
        userDto.setPermissions(new HashSet<>(permissionNames));

        return userDto;
    }

    /**
     * Get user by email
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var roleNames = userRoleRepository.findRoleNamesByUserId(user.getId());
        var permissionNames = userRoleRepository.findPermissionNamesByUserId(user.getId());

        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        userDto.setRoles(new HashSet<>(roleNames));
        userDto.setPermissions(new HashSet<>(permissionNames));

        return userDto;
    }

    @Override
    @Transactional
    public UserResponseDto updateProfile(User user, UpdateProfileRequest request) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setAddress(request.address());

        User updatedUser = userRepository.save(user);

        var roleNames = userRoleRepository.findRoleNamesByUserId(user.getId());
        var permissionNames = userRoleRepository.findPermissionNamesByUserId(user.getId());

        UserResponseDto userDto = userMapper.toUserResponseDto(updatedUser);
        userDto.setRoles(new HashSet<>(roleNames));
        userDto.setPermissions(new HashSet<>(permissionNames));

        return userDto;
    }

    @Override
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        String hashedNewPassword = passwordEncoder.encode(request.newPassword());

        user.setPasswordHash(hashedNewPassword);
        userRepository.save(user);
    }

    /**
     * Get public role
     */
    @Override
    @Transactional(readOnly = true)
    public List<RoleResponseDto> getPublicRole() {
        List<Role> roles = roleRepository.findAllExceptAdmin();
        return roleMapper.toRoleResponseDtoList(roles);
    }

    /**
     * Deactivate user account
     */
    @Override
    @Transactional
    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }
}
