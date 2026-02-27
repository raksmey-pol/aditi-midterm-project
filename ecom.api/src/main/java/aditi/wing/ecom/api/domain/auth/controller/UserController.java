package aditi.wing.ecom.api.domain.auth.controller;
import aditi.wing.ecom.api.domain.auth.dto.UserStatsDto;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import aditi.wing.ecom.api.domain.auth.service.AuthService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/buyers")
@RequiredArgsConstructor
public class UserController {

    private final AuthService userService;
    private final UserRepository userRepository;

    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsDto> getUserStats(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return ResponseEntity.ok(userService.getUserStats(user.getId()));
    }
}