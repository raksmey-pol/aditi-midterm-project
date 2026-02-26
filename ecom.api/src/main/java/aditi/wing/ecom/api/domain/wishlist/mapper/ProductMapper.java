package aditi.wing.ecom.api.domain.wishlist.mapper;


import aditi.wing.ecom.api.domain.seller.dto.ProductResponseDto;
import aditi.wing.ecom.api.domain.seller.model.Product;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponseDto toProductResponseDto(Product product);

    List<ProductResponseDto> toProductResponseDtoList(List<Product> products);
}