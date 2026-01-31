# JWT Token Enhancement - UUID and User Entity Extraction

## Overview

The JWT token functionality has been enhanced to include the user's UUID and provide methods to extract both the UUID and full User entity from the token.

## Changes Made

### 1. JwtMiddleware.java

**New Features:**

- **UUID in Token**: The JWT token now includes the user's UUID as a claim
- **getUserIdFromToken()**: Extract UUID from token
- **getUserFromToken()**: Fetch the full User entity from database using the UUID in the token

**Updated Methods:**

- `generateToken(String email, UUID userId, Set<String> roles)` - Now requires userId parameter

**New Methods:**

```java
// Get user UUID from JWT token
public UUID getUserIdFromToken(String token)

// Get full User entity from JWT token
public Optional<User> getUserFromToken(String token)
```

### 2. AuthServiceImpl.java

Updated all calls to `generateToken()` to include the user's UUID:

- Login method
- Register method

### 3. JwtUtil.java (NEW)

A utility class to easily extract user information from HTTP requests:

```java
// Extract JWT token from Authorization header
public String extractTokenFromRequest(HttpServletRequest request)

// Get user email from current request
public String getEmailFromRequest(HttpServletRequest request)

// Get user UUID from current request
public UUID getUserIdFromRequest(HttpServletRequest request)

// Get full User entity from current request
public Optional<User> getUserFromRequest(HttpServletRequest request)
```

### 4. ExampleUserController.java (NEW)

Example controller demonstrating how to use the new functionality:

- `/api/example/current-user-email` - Returns current user's email
- `/api/example/current-user-id` - Returns current user's UUID
- `/api/example/current-user` - Returns current user's full details

## Usage Examples

### Option 1: Using JwtMiddleware directly

```java
@RestController
@RequiredArgsConstructor
public class MyController {
    private final JwtMiddleware jwtMiddleware;

    @GetMapping("/my-endpoint")
    public ResponseEntity<?> myEndpoint(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "

        // Get email (existing functionality)
        String email = jwtMiddleware.getEmailFromToken(token);

        // Get UUID (NEW)
        UUID userId = jwtMiddleware.getUserIdFromToken(token);

        // Get full User entity (NEW)
        Optional<User> user = jwtMiddleware.getUserFromToken(token);

        return ResponseEntity.ok(user);
    }
}
```

### Option 2: Using JwtUtil (Recommended)

```java
@RestController
@RequiredArgsConstructor
public class MyController {
    private final JwtUtil jwtUtil;

    @GetMapping("/my-endpoint")
    public ResponseEntity<?> myEndpoint(HttpServletRequest request) {
        // Get email
        String email = jwtUtil.getEmailFromRequest(request);

        // Get UUID
        UUID userId = jwtUtil.getUserIdFromRequest(request);

        // Get full User entity
        Optional<User> user = jwtUtil.getUserFromRequest(request);

        if (user.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User currentUser = user.get();
        // Use currentUser.getEmail(), currentUser.getId(), etc.

        return ResponseEntity.ok(currentUser);
    }
}
```

### Option 3: Using Spring Security (Alternative)

```java
@RestController
public class MyController {

    @GetMapping("/my-endpoint")
    public ResponseEntity<?> myEndpoint() {
        // Get email from SecurityContext (still works)
        String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

        // For UUID and User entity, use JwtUtil or JwtMiddleware as shown above
        return ResponseEntity.ok(email);
    }
}
```

## Benefits

1. **UUID Access**: You can now get the user's UUID without making a database query
2. **User Entity Access**: Easily fetch the full User entity when needed
3. **Type Safety**: UUID provides type safety compared to string-based identifiers
4. **Convenience**: JwtUtil provides a simple API for common use cases
5. **Performance**: UUID is stored in the token, so you can access it without a DB query (only getUserFromToken requires a DB query)

## Testing

You can test the new endpoints using curl:

```bash
# Login to get a token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","passwordHash":"password"}'

# Use the token to test the new endpoints
curl -X GET http://localhost:8080/api/example/current-user-email \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

curl -X GET http://localhost:8080/api/example/current-user-id \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

curl -X GET http://localhost:8080/api/example/current-user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Migration Notes

- **Breaking Change**: The `generateToken()` method signature has changed. All calls must now include the userId parameter.
- **Existing Tokens**: Old tokens (generated before this change) will not have the userId claim and will return null when calling `getUserIdFromToken()`
- **Backward Compatibility**: The existing `getEmailFromToken()` method still works as before
