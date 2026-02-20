package aditi.wing.ecom.api.domain.auth.controller;

import java.util.List;
import java.util.UUID;

import aditi.wing.ecom.api.domain.auth.dto.*;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import aditi.wing.ecom.api.common.util.JwtUtil;
import aditi.wing.ecom.api.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly in production
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            // Validate input
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Email is required"));
            }
            if (loginRequest.getPasswordHash() == null || loginRequest.getPasswordHash().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Password is required"));
            }

            LoginResponseDto response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Register endpoint
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        try {
            LoginResponseDto response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Simple error response class
    private record ErrorResponse(String message) {
    }

    // Logout response class
    private record LogoutResponse(String message, String details) {
    }

    /**
     * Logout endpoint - Invalidate token
     * POST /api/auth/logout
     * Note: JWT tokens are stateless. Client should discard the token.
     * In production, consider implementing a token blacklist with Redis.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Extract token from request to validate it exists
            String token = jwtUtil.extractTokenFromRequest(request);

            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("No token provided"));
            }

            // TODO: In production, add token to blacklist (e.g., Redis) for invalidation
            // For now, client should discard the token on their end

            return ResponseEntity.ok(new LogoutResponse(
                    "Logout successful",
                    "Token has been invalidated. Please discard the token on client side."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Logout failed: " + e.getMessage()));
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     * Extracts user information from JWT token in Authorization header
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Extract user email from JWT token
            String email = jwtUtil.getEmailFromRequest(request);

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid or missing token"));
            }

            UserResponseDto response = authService.getUserByEmail(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("User not found: " + e.getMessage()));
        }
    }

    /**
     * Get user by ID
     * GET /api/auth/users/{userId}
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID userId) {
        try {
            UserResponseDto response = authService.getUserById(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateSelf(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest updateDto) {

        String email = jwtUtil.getEmailFromRequest(request);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Pass the entity directly to the service
        return ResponseEntity.ok(authService.updateProfile(user, updateDto));
    }

//    /**
//     * Update user profile
//     * PUT /api/auth/users/{userId}
//     */
//    This one should be in AdminController instead
//    @PutMapping("/users/{userId}")
//    public ResponseEntity<UserResponseDto> updateUser(
//            @PathVariable UUID userId,
//            @RequestBody RegisterRequestDto updateRequest) {
//        try {
//            UserResponseDto response = authService.updateProfile(userId, updateRequest);
//            return ResponseEntity.ok(response);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        }
//    }

    /**
     * Deactivate user account
     * DELETE /api/auth/users/{userId}
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID userId) {
        try {
            authService.deactivateUser(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get all public roles
     * GET /api/auth/roles
     */
    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponseDto>> getPublicRole() {
        try {
            List<RoleResponseDto> response = authService.getPublicRole();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}
