package com.college.placement.portal.profile.controller;

import com.college.placement.portal.profile.dto.AdminProfileUpdateDto;
import com.college.placement.portal.profile.dto.AdminProfileViewDto;
import com.college.placement.portal.profile.service.AdminProfileService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PostMapping(
            value = "/photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadProfilePhoto(
            @RequestParam("photo") MultipartFile photo
    ) throws Exception {

        return ResponseEntity.ok(
                adminProfileService.uploadProfilePhoto(photo)
        );
    }

    // ==========================
    // DELETE PHOTO
    // ==========================

    @DeleteMapping("/photo")
    public ResponseEntity<String> deleteProfilePhoto() {

        return ResponseEntity.ok(
                adminProfileService.deleteProfilePhoto()
        );
    }

}