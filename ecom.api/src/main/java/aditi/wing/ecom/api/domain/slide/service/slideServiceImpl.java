package aditi.wing.ecom.api.domain.slide.service;

import aditi.wing.ecom.api.domain.slide.dto.SlideDto;
import aditi.wing.ecom.api.domain.slide.model.Slide;
import aditi.wing.ecom.api.domain.slide.mapper.SlideMapper;
import aditi.wing.ecom.api.domain.slide.repository.SlideRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class slideServiceImpl implements SlideService {

	private final SlideRepository slideRepository;

	private final SlideMapper slideMapper;

	@Override
	public SlideDto createSlide(SlideDto slideDto) {
		Slide slide = slideMapper.toEntity(slideDto);
		Slide saved = slideRepository.save(slide);
		return slideMapper.toDto(saved);
	}

	@Override
	public SlideDto getSlideById(Long id) {
		Optional<Slide> slide = slideRepository.findById(id);
		return slide.map(slideMapper::toDto).orElse(null);
	}

	@Override
	public List<SlideDto> getAllSlides() {
		return slideMapper.toDtoList(slideRepository.findAll());
	}

	@Override
	public SlideDto updateSlide(Long id, SlideDto slideDto) {
		Optional<Slide> optionalSlide = slideRepository.findById(id);
		if (optionalSlide.isPresent()) {
			Slide slide = optionalSlide.get();
			slide.setTitle(slideDto.getTitle());
			slide.setImageUrl(slideDto.getImageUrl());
			slide.setLink(slideDto.getLink());
			slide.setDescription(slideDto.getDescription());
			Slide updated = slideRepository.save(slide);
			return slideMapper.toDto(updated);
		}
		return null;
	}

	@Override
	public void deleteSlide(Long id) {
		slideRepository.deleteById(id);
	}
}
