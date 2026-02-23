package aditi.wing.ecom.api.domain.address.service;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.auth.model.User;

import java.util.List;

public interface AddressService {
    AddressResponse createAddress(User user, AddressRequest addressRequest);
    List<AddressResponse> getUserAddresses(User user);
}
