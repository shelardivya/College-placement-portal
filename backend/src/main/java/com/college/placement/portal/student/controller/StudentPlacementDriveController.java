package com.college.placement.portal.student.controller;

import com.college.placement.portal.student.Dto.StudentPlacementDriveResponseDto;
import com.college.placement.portal.student.service.StudentPlacementDriveService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/placement-drive")
public class StudentPlacementDriveController {

    private final StudentPlacementDriveService studentPlacementDriveService;

    public StudentPlacementDriveController(
            StudentPlacementDriveService studentPlacementDriveService
    ) {
        this.studentPlacementDriveService = studentPlacementDriveService;
    }

    // ==========================================
    // View All Placement Drives
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<StudentPlacementDriveResponseDto>> getAllPlacementDrives(
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                studentPlacementDriveService.getAllPlacementDrives(request)
        );

    }

    // ==========================================
    // View Placement Drive By Id
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<StudentPlacementDriveResponseDto> getPlacementDriveById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                studentPlacementDriveService.getPlacementDriveById(id, request)
        );

    }

}