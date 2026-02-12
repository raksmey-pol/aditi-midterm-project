package aditi.wing.ecom.api.domain.orders.mapper;

import aditi.wing.ecom.api.domain.orders.dto.*;
import aditi.wing.ecom.api.domain.orders.model.Order;
import aditi.wing.ecom.api.domain.orders.model.OrderItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    // --- REQUEST TO ENTITY ---
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "buyerId", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "items", source = "items")
    Order toEntity(OrderRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    OrderItem toItemEntity(OrderItemRequest itemRequest);

    @AfterMapping
    default void linkItems(@MappingTarget Order order) {
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
    }

    // --- ENTITY TO RESPONSE ---
    OrderResponse toResponse(Order order);

    // ADD THIS: MapStruct uses this to map the List<OrderItem> -> List<OrderItemResponse>
    OrderItemResponse toItemResponse(OrderItem orderItem);
}