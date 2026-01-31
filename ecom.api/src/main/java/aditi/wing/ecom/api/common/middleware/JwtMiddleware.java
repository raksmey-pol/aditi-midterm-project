package aditi.wing.ecom.api.common.middleware;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

@Service
@RequiredArgsConstructor
public class JwtMiddleware {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    private final UserRepository userRepository;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @Value("${jwt.refresh.expiration}")
    private int jwtRefreshExpirationMs;

    // Generate JWT token with RSA512
    public String generateToken(String email, UUID userId, Set<String> roles) {
        return Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("userId", userId.toString())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(privateKey, Jwts.SIG.RS512)
                .compact();
    }

    // Generate refresh token with longer expiration
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("type", "refresh")
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs))
                .signWith(privateKey, Jwts.SIG.RS512)
                .compact();
    }

    // Get email from JWT token
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Get user UUID from JWT token
    public UUID getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String userId = claims.get("userId", String.class);
        return userId != null ? UUID.fromString(userId) : null;
    }

    // Get full User entity from JWT token
    public Optional<User> getUserFromToken(String token) {
        UUID userId = getUserIdFromToken(token);
        if (userId == null) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }

    // Get roles from JWT token
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("roles", List.class);
    }

    // Validate JWT token
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
