
package aditi.wing.ecom.api.domain.slide.service;

import aditi.wing.ecom.api.domain.slide.dto.SlideDto;
import java.util.List;

public interface SlideService {
	SlideDto createSlide(SlideDto slideDto);
	SlideDto getSlideById(Long id);
	List<SlideDto> getAllSlides();
	SlideDto updateSlide(Long id, SlideDto slideDto);
	void deleteSlide(Long id);
}
