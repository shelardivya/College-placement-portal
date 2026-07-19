package com.college.placement.portal.profile.controller;

import com.college.placement.portal.profile.Dto.StudentProfileUpdateDto;
import com.college.placement.portal.profile.Dto.StudentProfileViewDto;
import com.college.placement.portal.profile.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}