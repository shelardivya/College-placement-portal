package com.college.placement.portal.profile.controller;

import com.college.placement.portal.profile.dto.StudentProfileUpdateDto;
import com.college.placement.portal.profile.dto.StudentProfileViewDto;
import com.college.placement.portal.profile.service.StudentProfileService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(
            StudentProfileService studentProfileService
    ) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileViewDto> getProfile() {

        return ResponseEntity.ok(
                studentProfileService.getProfile()
        );

    }

    @PutMapping
    public ResponseEntity<StudentProfileViewDto> updateProfile(
            @RequestBody StudentProfileUpdateDto dto
    ) {

        studentProfileService.updateProfile(dto);

        return ResponseEntity.ok(
                studentProfileService.getProfile()
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
                studentProfileService.uploadProfilePhoto(photo)
        );
    }
    @DeleteMapping("/photo")
    public ResponseEntity<String> deleteProfilePhoto() {

        return ResponseEntity.ok(
                studentProfileService.deleteProfilePhoto()
        );
    }

}