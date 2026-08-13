package com.college.placement.portal.profile.controller;

import com.college.placement.portal.profile.dto.AdminProfileUpdateDto;
import com.college.placement.portal.profile.dto.AdminProfileViewDto;
import com.college.placement.portal.profile.service.AdminProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    public AdminProfileController(AdminProfileService adminProfileService) {
        this.adminProfileService = adminProfileService;
    }

    @GetMapping
    public ResponseEntity<AdminProfileViewDto> getProfile() {

        return ResponseEntity.ok(
                adminProfileService.getProfile()
        );

    }

    @PutMapping
    public ResponseEntity<String> updateProfile(
            @RequestBody AdminProfileUpdateDto dto
    ) {

        return ResponseEntity.ok(
                adminProfileService.updateProfile(dto)
        );

    }

}