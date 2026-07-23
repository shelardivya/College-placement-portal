package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.ApplicantMatchingDto;
import com.college.placement.portal.admin.service.ApplicantMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applicants")
public class ApplicantMatchingController {

    private final ApplicantMatchingService applicantMatchingService;

    public ApplicantMatchingController(
            ApplicantMatchingService applicantMatchingService
    ) {
        this.applicantMatchingService = applicantMatchingService;
    }

    @GetMapping("/matching")
    public ResponseEntity<List<ApplicantMatchingDto>> getApplicants() {

        return ResponseEntity.ok(
                applicantMatchingService.getApplicants()
        );

    }

}