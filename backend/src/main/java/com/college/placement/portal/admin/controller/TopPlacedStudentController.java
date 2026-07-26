package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.AddTopPlacedStudentRequestDto;
import com.college.placement.portal.admin.dto.TopPlacedStudentResponseDto;
import com.college.placement.portal.admin.service.TopPlacedStudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/top-placed-student")
public class TopPlacedStudentController {

    private final TopPlacedStudentService topPlacedStudentService;

    public TopPlacedStudentController(
            TopPlacedStudentService topPlacedStudentService
    ) {
        this.topPlacedStudentService = topPlacedStudentService;
    }

    // ==========================================
    // Add Top Placed Student
    // ==========================================

    @PostMapping("/add")
    public ResponseEntity<String> addTopPlacedStudent(
            @Valid @RequestBody AddTopPlacedStudentRequestDto request
    ) {

        return ResponseEntity.ok(
                topPlacedStudentService.addTopPlacedStudent(request)
        );

    }

    // ==========================================
    // View All Top Placed Students
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<TopPlacedStudentResponseDto>>
    getAllTopPlacedStudents() {

        return ResponseEntity.ok(
                topPlacedStudentService.getAllTopPlacedStudents()
        );

    }

    // ==========================================
    // Get Top Placed Student By Id
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<TopPlacedStudentResponseDto>
    getTopPlacedStudentById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                topPlacedStudentService.getTopPlacedStudentById(id)
        );

    }

    // ==========================================
    // Update Top Placed Student
    // ==========================================

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTopPlacedStudent(
            @PathVariable Long id,
            @Valid @RequestBody AddTopPlacedStudentRequestDto request
    ) {

        return ResponseEntity.ok(
                topPlacedStudentService.updateTopPlacedStudent(id, request)
        );

    }

    // ==========================================
    // Delete Top Placed Student
    // ==========================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTopPlacedStudent(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                topPlacedStudentService.deleteTopPlacedStudent(id)
        );

    }

}