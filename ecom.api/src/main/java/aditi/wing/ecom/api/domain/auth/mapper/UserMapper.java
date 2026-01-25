package aditi.wing.ecom.api.domain.auth.mapper;

import aditi.wing.ecom.api.domain.auth.dto.RegisterRequestDto;
import aditi.wing.ecom.api.domain.auth.dto.UserResponseDto;
import aditi.wing.ecom.api.domain.auth.model.User;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.Instant;

@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Maps User entity to UserResponseDto
     * Note: roles and permissions need to be set separately from UserRole and
     * RolePermission relationships
     */
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToInstant")
    @Mapping(source = "updatedAt", target = "updatedAt", qualifiedByName = "localDateTimeToInstant")
    UserResponseDto toUserResponseDto(User user);

    /**
     * Maps RegisterRequestDto to User entity
     * Note: createdAt and updatedAt will be set by @PrePersist
     */
    @Mapping(target = "emailVerified", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(RegisterRequestDto registerRequestDto);

    /**
     * Updates existing User entity with data from RegisterRequestDto
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    void updateUserFromDto(RegisterRequestDto dto, @MappingTarget User user);

    @Named("localDateTimeToInstant")
    default Instant localDateTimeToInstant(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.toInstant(ZoneOffset.UTC) : null;
    }
}
