package com.college.placement.portal.student.controller;

import com.college.placement.portal.student.Dto.StudentQueryResponseDto;
import com.college.placement.portal.student.Dto.SubmitQueryRequestDto;
import com.college.placement.portal.student.service.StudentQueryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/query")
public class StudentQueryController {

    private final StudentQueryService studentQueryService;

    public StudentQueryController(
            StudentQueryService studentQueryService
    ) {
        this.studentQueryService = studentQueryService;
    }

    // ==========================================
    // Submit Query
    // ==========================================

    @PostMapping
    public ResponseEntity<String> submitQuery(
            @Valid @RequestBody SubmitQueryRequestDto request,
            HttpServletRequest httpRequest
    ) {

        return ResponseEntity.ok(
                studentQueryService.submitQuery(
                        request,
                        httpRequest
                )
        );

    }

    // ==========================================
    // View My Queries
    // ==========================================

    @GetMapping
    public ResponseEntity<List<StudentQueryResponseDto>>
    getMyQueries(
            HttpServletRequest httpRequest
    ) {

        return ResponseEntity.ok(
                studentQueryService.getMyQueries(
                        httpRequest
                )
        );

    }

    // ==========================================
    // View Query By Id
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<StudentQueryResponseDto>
    getQueryById(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {

        return ResponseEntity.ok(
                studentQueryService.getQueryById(
                        id,
                        httpRequest
                )
        );

    }

}