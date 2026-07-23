package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.AdminQueryResponseDto;
import com.college.placement.portal.admin.dto.ReplyQueryRequestDto;
import com.college.placement.portal.admin.service.AdminQueryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/query")
public class AdminQueryController {

    private final AdminQueryService adminQueryService;

    public AdminQueryController(
            AdminQueryService adminQueryService
    ) {
        this.adminQueryService = adminQueryService;
    }

    // ==========================================
    // View All Queries
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<AdminQueryResponseDto>>
    getAllQueries() {

        return ResponseEntity.ok(
                adminQueryService.getAllQueries()
        );

    }

    // ==========================================
    // View Pending Queries
    // ==========================================

    @GetMapping("/pending")
    public ResponseEntity<List<AdminQueryResponseDto>>
    getPendingQueries() {

        return ResponseEntity.ok(
                adminQueryService.getPendingQueries()
        );

    }

    // ==========================================
    // View Resolved Queries
    // ==========================================

    @GetMapping("/resolved")
    public ResponseEntity<List<AdminQueryResponseDto>>
    getResolvedQueries() {

        return ResponseEntity.ok(
                adminQueryService.getResolvedQueries()
        );

    }

    // ==========================================
    // View Query By Id
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<AdminQueryResponseDto>
    getQueryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminQueryService.getQueryById(id)
        );

    }

    // ==========================================
    // Reply To Student Query
    // ==========================================

    @PutMapping("/{id}/reply")
    public ResponseEntity<String>
    replyToQuery(
            @PathVariable Long id,
            @Valid @RequestBody ReplyQueryRequestDto request
    ) {

        return ResponseEntity.ok(
                adminQueryService.replyToQuery(id, request)
        );

    }

}