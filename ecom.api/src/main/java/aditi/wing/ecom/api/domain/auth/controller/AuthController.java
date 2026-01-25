package aditi.wing.ecom.api.domain.auth.controller;

import java.util.UUID;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import aditi.wing.ecom.api.domain.auth.dto.LoginRequestDto;
import aditi.wing.ecom.api.domain.auth.dto.LoginResponseDto;
import aditi.wing.ecom.api.domain.auth.dto.RegisterRequestDto;
import aditi.wing.ecom.api.domain.auth.dto.UserResponseDto;
import aditi.wing.ecom.api.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly in production
public class AuthController {

    private final AuthService authService;

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

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@RequestParam String email) {
        // TODO: Extract user from JWT token instead of query parameter
        try {
            UserResponseDto response = authService.getUserByEmail(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
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

    /**
     * Update user profile
     * PUT /api/auth/users/{userId}
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable UUID userId,
            @RequestBody RegisterRequestDto updateRequest) {
        try {
            UserResponseDto response = authService.updateUser(userId, updateRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

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
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}
