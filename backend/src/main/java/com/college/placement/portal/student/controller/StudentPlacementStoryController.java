package com.college.placement.portal.student.controller;

import com.college.placement.portal.admin.dto.PlacementStoryResponseDto;
import com.college.placement.portal.student.service.StudentPlacementStoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/story")
public class StudentPlacementStoryController {

    private final StudentPlacementStoryService studentPlacementStoryService;

    public StudentPlacementStoryController(
            StudentPlacementStoryService studentPlacementStoryService
    ) {
        this.studentPlacementStoryService = studentPlacementStoryService;
    }

    // ==========================================
    // View All Placement Stories
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<PlacementStoryResponseDto>> getAllStories() {

        return ResponseEntity.ok(
                studentPlacementStoryService.getAllStories()
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
                studentPlacementStoryService.getStoryById(id)
        );

    }

}