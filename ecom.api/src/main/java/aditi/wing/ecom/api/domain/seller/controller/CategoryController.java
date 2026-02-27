package aditi.wing.ecom.api.domain.seller.controller;

import aditi.wing.ecom.api.domain.admin.dto.AdminCategoryDto;
import aditi.wing.ecom.api.domain.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(adminService.getAllCategories());
    }
}
