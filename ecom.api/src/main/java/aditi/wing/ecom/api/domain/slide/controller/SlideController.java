package aditi.wing.ecom.api.domain.slide.controller;

import aditi.wing.ecom.api.domain.slide.dto.SlideDto;
import aditi.wing.ecom.api.domain.slide.service.SlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slides")
@RequiredArgsConstructor
public class SlideController {
    private final SlideService slideService;

    @PostMapping
    public ResponseEntity<SlideDto> createSlide(@RequestBody SlideDto slideDto) {
        return ResponseEntity.ok(slideService.createSlide(slideDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SlideDto> getSlideById(@PathVariable Long id) {
        SlideDto slide = slideService.getSlideById(id);
        if (slide == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(slide);
    }

    @GetMapping
    public ResponseEntity<List<SlideDto>> getAllSlides() {
        return ResponseEntity.ok(slideService.getAllSlides());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SlideDto> updateSlide(@PathVariable Long id, @RequestBody SlideDto slideDto) {
        SlideDto updated = slideService.updateSlide(id, slideDto);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlide(@PathVariable Long id) {
        slideService.deleteSlide(id);
        return ResponseEntity.noContent().build();
    }
}
