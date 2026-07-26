package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.AddPlacementDriveRequestDto;
import com.college.placement.portal.admin.dto.PlacementDriveResponseDto;
import com.college.placement.portal.admin.service.PlacementDriveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/placement-drive")
public class PlacementDriveController {

    private final PlacementDriveService placementDriveService;

    public PlacementDriveController(
            PlacementDriveService placementDriveService
    ) {
        this.placementDriveService = placementDriveService;
    }

    // ==========================================
    // Add Placement Drive
    // ==========================================

    @PostMapping("/add")
    public ResponseEntity<String> addPlacementDrive(
            @RequestBody AddPlacementDriveRequestDto request
    ) {

        return ResponseEntity.ok(
                placementDriveService.addPlacementDrive(request)
        );

    }

    // ==========================================
// View All Placement Drives
// ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<PlacementDriveResponseDto>>
    getAllPlacementDrives() {

        return ResponseEntity.ok(
                placementDriveService.getAllPlacementDrives()
        );

    }

    // ==========================================
// Get Placement Drive By Id
// ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<PlacementDriveResponseDto>
    getPlacementDriveById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                placementDriveService.getPlacementDriveById(id)
        );

    }

    // ==========================================
// Update Placement Drive
// ==========================================

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePlacementDrive(
            @PathVariable Long id,
            @RequestBody AddPlacementDriveRequestDto request
    ) {

        return ResponseEntity.ok(
                placementDriveService.updatePlacementDrive(id, request)
        );

    }
    // ==========================================
// Delete Placement Drive
// ==========================================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePlacementDrive(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                placementDriveService.deletePlacementDrive(id)
        );

    }

}