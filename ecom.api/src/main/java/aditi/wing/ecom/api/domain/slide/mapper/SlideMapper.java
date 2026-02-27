package aditi.wing.ecom.api.domain.slide.mapper;

import aditi.wing.ecom.api.domain.slide.dto.SlideDto;
import aditi.wing.ecom.api.domain.slide.model.Slide;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper(componentModel = "spring")
public interface SlideMapper {
    SlideMapper INSTANCE = Mappers.getMapper(SlideMapper.class);
    SlideDto toDto(Slide slide);
    Slide toEntity(SlideDto dto);
    List<SlideDto> toDtoList(List<Slide> slides);
    List<Slide> toEntityList(List<SlideDto> dtos);
}
