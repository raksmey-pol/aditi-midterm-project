package aditi.wing.ecom.api.common.middleware;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

@Service
public class JwtMiddleware {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @Value("${jwt.refresh.expiration}")
    private int jwtRefreshExpirationMs;

    public JwtMiddleware(PrivateKey privateKey, PublicKey publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    // Generate JWT token with RSA512
    public String generateToken(String email, Set<String> roles) {
        return Jwts.builder()
                .subject(email)
                .claim("email", email)
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
