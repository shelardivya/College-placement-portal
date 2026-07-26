package com.college.placement.portal.student.controller;

import com.college.placement.portal.student.Dto.ResumeMatchDto;
import com.college.placement.portal.student.service.ResumeMatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class ResumeMatchController {

    private final ResumeMatchService resumeMatchService;

    public ResumeMatchController(ResumeMatchService resumeMatchService) {
        this.resumeMatchService = resumeMatchService;
    }

    @GetMapping("/resume-match")
    public ResponseEntity<List<ResumeMatchDto>> getResumeMatches() {

        return ResponseEntity.ok(
                resumeMatchService.getResumeMatches()
        );

    }

}