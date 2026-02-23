package aditi.wing.ecom.api.domain.address.controller;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.address.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @RequestBody AddressRequest request,
            Principal principal) {
        return ResponseEntity.ok(addressService.createAddress(request, principal.getName()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<AddressResponse>> getMyAddresses(Principal principal) {
        return ResponseEntity.ok(addressService.getMyAddresses(principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable UUID id,
            Principal principal) {
        addressService.deleteAddress(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}