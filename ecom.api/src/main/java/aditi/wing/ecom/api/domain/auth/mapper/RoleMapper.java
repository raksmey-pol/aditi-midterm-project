package aditi.wing.ecom.api.domain.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import aditi.wing.ecom.api.domain.auth.dto.RoleResponeDto;
import aditi.wing.ecom.api.domain.auth.model.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    /**
     * Convert Role entity to RoleResponseDto
     */
    RoleResponeDto toRoleResponseDto(Role role);

    /**
     * Convert list of Role entities to list of RoleResponseDto
     */
    List<RoleResponeDto> toRoleResponseDtoList(List<Role> roles);
}
