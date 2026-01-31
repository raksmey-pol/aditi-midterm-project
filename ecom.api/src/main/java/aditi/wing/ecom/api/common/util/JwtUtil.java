package aditi.wing.ecom.api.common.util;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import aditi.wing.ecom.api.common.middleware.JwtMiddleware;
import aditi.wing.ecom.api.domain.auth.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * Utility class to extract JWT token information from HTTP requests
 */
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtMiddleware jwtMiddleware;

    /**
     * Extract JWT token from Authorization header
     * 
     * @param request HTTP request
     * @return JWT token string or null if not present
     */
    public String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    /**
     * Get user email from current request
     * 
     * @param request HTTP request
     * @return user email or null if token not present or invalid
     */
    public String getEmailFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null && jwtMiddleware.validateJwtToken(token)) {
            return jwtMiddleware.getEmailFromToken(token);
        }
        return null;
    }

    /**
     * Get user UUID from current request
     * 
     * @param request HTTP request
     * @return user UUID or null if token not present or invalid
     */
    public UUID getUserIdFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null && jwtMiddleware.validateJwtToken(token)) {
            return jwtMiddleware.getUserIdFromToken(token);
        }
        return null;
    }

    /**
     * Get full User entity from current request
     * 
     * @param request HTTP request
     * @return Optional containing User entity if found, empty otherwise
     */
    public Optional<User> getUserFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null && jwtMiddleware.validateJwtToken(token)) {
            return jwtMiddleware.getUserFromToken(token);
        }
        return Optional.empty();
    }
}
