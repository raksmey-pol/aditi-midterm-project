package aditi.wing.ecom.api.domain.address.service;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.auth.model.User;

import java.util.List;
import java.util.UUID;

public interface AddressService {
    AddressResponse createAddress(User user, AddressRequest addressRequest);
    List<AddressResponse> getUserAddresses(User user);
    AddressResponse getAddressById(User user, UUID id);
    AddressResponse updateAddress(User user, UUID id, AddressRequest addressRequest);
    void deleteAddress(User user, UUID id);
}
