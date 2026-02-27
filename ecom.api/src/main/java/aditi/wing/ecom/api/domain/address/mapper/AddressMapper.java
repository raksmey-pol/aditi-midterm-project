package aditi.wing.ecom.api.domain.address.mapper;

import aditi.wing.ecom.api.domain.address.dto.AddressRequest;
import aditi.wing.ecom.api.domain.address.dto.AddressResponse;
import aditi.wing.ecom.api.domain.address.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AddressMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressRequest request);

    @Mapping(target = "isDefault", source = "default")
    AddressResponse toResponse(Address entity);
}
