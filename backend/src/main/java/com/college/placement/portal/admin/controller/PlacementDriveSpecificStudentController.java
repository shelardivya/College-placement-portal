package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.PlacementDriveSpecificStudentDto;
import com.college.placement.portal.admin.service.PlacementDriveSpecificStudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/placement-drive")
public class PlacementDriveSpecificStudentController {

    private final PlacementDriveSpecificStudentService placementDriveSpecificStudentService;

    public PlacementDriveSpecificStudentController(
            PlacementDriveSpecificStudentService placementDriveSpecificStudentService
    ) {
        this.placementDriveSpecificStudentService = placementDriveSpecificStudentService;
    }

    // ==========================================
    // Get All Registered Students
    // ==========================================

    @GetMapping("/specific-students")
    public ResponseEntity<List<PlacementDriveSpecificStudentDto>> getAllStudents() {

        return ResponseEntity.ok(
                placementDriveSpecificStudentService.getAllStudents()
        );

    }

}