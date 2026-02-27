package aditi.wing.ecom.api.domain.slide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlideDto {
    private Long id;
    private String title;
    private String imageUrl;
    private String link;
    private String description;
}
