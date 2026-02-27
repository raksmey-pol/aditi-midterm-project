package aditi.wing.ecom.api.domain.auth.service;

import java.util.List;
import java.util.UUID;

import aditi.wing.ecom.api.domain.auth.dto.*;
import aditi.wing.ecom.api.domain.auth.model.User;
import org.springframework.transaction.annotation.Transactional;

public interface AuthService {

    /**
     * Authenticate user and generate tokens
     */
    LoginResponseDto login(LoginRequestDto loginRequest);

    /**
     * Register a new user and generate tokens
     */
    LoginResponseDto register(RegisterRequestDto registerRequest);

    /**
     * Get user by ID with roles and permissions
     */
    UserResponseDto getUserById(UUID userId);

    /**
     * Get user by email
     */
    UserResponseDto getUserByEmail(String email);

    /**
     * Update user profile
     */
    UserResponseDto updateProfile(User user, UpdateProfileRequest updateRequest);

    /**
     * Change user password
     */
    void changePassword(User user, ChangePasswordRequest request);

    /**
     * Get public role
     */
    List<RoleResponseDto> getPublicRole();

    /**
     * Deactivate user account
     */
    void deactivateUser(UUID userId);

    UserStatsDto getUserStats(UUID userId);
}
