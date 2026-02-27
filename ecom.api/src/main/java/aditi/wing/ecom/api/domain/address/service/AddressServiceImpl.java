package aditi.wing.ecom.api.domain.address.service;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.address.mapper.AddressMapper;
import aditi.wing.ecom.api.domain.address.model.Address;
import aditi.wing.ecom.api.domain.address.repository.AddressRepository;
import aditi.wing.ecom.api.domain.auth.model.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressById(User user, UUID id) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
        return addressMapper.toResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(User user, UUID id, AddressRequest request) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        // check label conflict only if label changed
        if (!address.getLabel().equalsIgnoreCase(request.label()) &&
                addressRepository.existsByUserAndLabelIgnoreCase(user, request.label())) {
            throw new IllegalArgumentException("You already have an address with the label: " + request.label());
        }

        if (request.isDefault()) {
            addressRepository.removeDefaultStatusForUser(user.getId());
        }

        address.setLabel(request.label());
        address.setRecipientName(request.recipientName());
        address.setPhoneNumber(request.phoneNumber());
        address.setStreet1(request.street1());
        address.setStreet2(request.street2());
        address.setCity(request.city());
        address.setState(request.state());
        address.setZipCode(request.zipCode());
        address.setCountry(request.country());
        address.setDefault(request.isDefault());

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(User user, UUID id) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        // if deleting default address, assign default to the next available address
        if (address.isDefault()) {
            addressRepository.findByUser(user).stream()
                    .filter(a -> !a.getId().equals(id))
                    .findFirst()
                    .ifPresent(a -> {
                        a.setDefault(true);
                        addressRepository.save(a);
                    });
        }

        addressRepository.delete(address);
    }
}
