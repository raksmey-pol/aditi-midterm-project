package aditi.wing.ecom.api.domain.slide.repository;

import aditi.wing.ecom.api.domain.slide.model.Slide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlideRepository extends JpaRepository<Slide, Long> {
}
