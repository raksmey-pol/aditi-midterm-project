package aditi.wing.ecom.api.domain.auth.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import aditi.wing.ecom.api.domain.auth.dto.RoleResponseDto;
import aditi.wing.ecom.api.domain.auth.model.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    /**
     * Convert Role entity to RoleResponseDto
     */
    RoleResponseDto toRoleResponseDto(Role role);

    /**
     * Convert list of Role entities to list of RoleResponseDto
     */
    List<RoleResponseDto> toRoleResponseDtoList(List<Role> roles);
}
