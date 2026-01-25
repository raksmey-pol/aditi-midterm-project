package aditi.wing.ecom.api.domain.auth.service;

import java.util.UUID;

import aditi.wing.ecom.api.domain.auth.dto.LoginRequestDto;
import aditi.wing.ecom.api.domain.auth.dto.LoginResponseDto;
import aditi.wing.ecom.api.domain.auth.dto.RegisterRequestDto;
import aditi.wing.ecom.api.domain.auth.dto.UserResponseDto;

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
    UserResponseDto updateUser(UUID userId, RegisterRequestDto updateRequest);

    /**
     * Deactivate user account
     */
    void deactivateUser(UUID userId);
}
