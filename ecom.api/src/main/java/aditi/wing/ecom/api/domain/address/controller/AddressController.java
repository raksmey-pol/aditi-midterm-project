package aditi.wing.ecom.api.domain.address.controller;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.address.service.AddressService;
import aditi.wing.ecom.api.domain.auth.model.User;
import aditi.wing.ecom.api.domain.auth.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            Principal principal,
            @Valid @RequestBody AddressRequest addressRequest) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AddressResponse newAddress = addressService.createAddress(user, addressRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAddress);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }
}
