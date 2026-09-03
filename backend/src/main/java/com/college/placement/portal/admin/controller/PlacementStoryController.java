package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.CreatePlacementStoryRequestDto;
import com.college.placement.portal.admin.dto.PlacementStoryResponseDto;
import com.college.placement.portal.admin.service.PlacementStoryService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/story")
public class PlacementStoryController {

    private final PlacementStoryService placementStoryService;

    public PlacementStoryController(
            PlacementStoryService placementStoryService
    ) {
        this.placementStoryService = placementStoryService;
    }

    // ==========================================
    // Publish Placement Story
    // ==========================================

    @PostMapping(
            value="/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> publishStory(

            @RequestParam String studentName,

            @RequestParam String companyName,

            @RequestParam String jobRole,

            @RequestParam Double packageLpa,

            @RequestParam String successStory,

            @RequestParam(required = false) MultipartFile photo

    ) throws IOException {

        CreatePlacementStoryRequestDto dto =
                new CreatePlacementStoryRequestDto();

        dto.setStudentName(studentName);
        dto.setCompanyName(companyName);
        dto.setJobRole(jobRole);
        dto.setPackageLpa(packageLpa);
        dto.setSuccessStory(successStory);
        dto.setPhoto(photo);

        return ResponseEntity.ok(
                placementStoryService.publishStory(dto)
        );

    }

    // ==========================================
    // View All Stories
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<PlacementStoryResponseDto>> getAllStories() {

        return ResponseEntity.ok(
                placementStoryService.getAllStories()
        );

    }

    // ==========================================
    // View Story By Id
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<PlacementStoryResponseDto> getStoryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                placementStoryService.getStoryById(id)
        );

    }

    // ==========================================
    // Update Story
    // ==========================================

    @PutMapping(
            value="/update/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> updateStory(

            @PathVariable Long id,

            @RequestParam String studentName,

            @RequestParam String companyName,

            @RequestParam String jobRole,

            @RequestParam Double packageLpa,

            @RequestParam String successStory,

            @RequestParam(required = false) MultipartFile photo

    ) throws IOException {

        CreatePlacementStoryRequestDto dto =
                new CreatePlacementStoryRequestDto();

        dto.setStudentName(studentName);
        dto.setCompanyName(companyName);
        dto.setJobRole(jobRole);
        dto.setPackageLpa(packageLpa);
        dto.setSuccessStory(successStory);
        dto.setPhoto(photo);

        return ResponseEntity.ok(
                placementStoryService.updateStory(id, dto)
        );

    }

    // ==========================================
    // Delete Story
    // ==========================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStory(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                placementStoryService.deleteStory(id)
        );

    }

}