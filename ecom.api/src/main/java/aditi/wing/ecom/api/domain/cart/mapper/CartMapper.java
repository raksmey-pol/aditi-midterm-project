package aditi.wing.ecom.api.domain.cart.mapper;

import aditi.wing.ecom.api.domain.cart.dto.CartItemResponse;
import aditi.wing.ecom.api.domain.cart.dto.CartResponse;
import aditi.wing.ecom.api.domain.cart.model.Cart;
import aditi.wing.ecom.api.domain.cart.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CartMapper {

    CartResponse toResponse(Cart cart);
    CartItemResponse toItemResponse(CartItem cartItem);
}