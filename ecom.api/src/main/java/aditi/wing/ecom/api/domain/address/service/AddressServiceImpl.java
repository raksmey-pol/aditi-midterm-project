package aditi.wing.ecom.api.domain.address.service;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.address.mapper.AddressMapper;
import aditi.wing.ecom.api.domain.address.model.Address;
import aditi.wing.ecom.api.domain.address.repository.AddressRepository;
import aditi.wing.ecom.api.domain.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public AddressResponse createAddress(User user, AddressRequest request) {

        if (addressRepository.existsByUserAndLabelIgnoreCase(user, request.label())) {
            throw new IllegalArgumentException("You already have an address with the label: " + request.label());
        }

        if (request.isDefault()) {
            addressRepository.removeDefaultStatusForUser(user.getId());
        }

        boolean isFirstAddress = addressRepository.countByUser(user) == 0;
        boolean finalIsDefault = request.isDefault() || isFirstAddress;

        Address address = addressMapper.toEntity(request);
        address.setUser(user);
        address.setDefault(finalIsDefault);

        Address savedAddress = addressRepository.save(address);

        return addressMapper.toResponse(savedAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(User user) {
        return addressRepository.findByUser(user).stream()
                .map(addressMapper::toResponse)
                .toList();
    }


}
