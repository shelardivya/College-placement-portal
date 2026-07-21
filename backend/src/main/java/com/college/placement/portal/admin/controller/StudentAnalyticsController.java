package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.CgpaPlacementDto;
import com.college.placement.portal.admin.dto.DepartmentAnalyticsDto;
import com.college.placement.portal.admin.dto.StudentAnalyticsDto;
import com.college.placement.portal.admin.service.StudentAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/student-analytics")
public class StudentAnalyticsController {

    private final StudentAnalyticsService studentAnalyticsService;

    public StudentAnalyticsController(
            StudentAnalyticsService studentAnalyticsService
    ) {
        this.studentAnalyticsService = studentAnalyticsService;
    }

    // ==========================================
    // Dashboard Stat Cards
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<StudentAnalyticsDto> getDashboardStats() {

        return ResponseEntity.ok(
                studentAnalyticsService.getDashboardStats()
        );

    }

    // ==========================================
// Department Distribution
// ==========================================

    @GetMapping("/department")
    public ResponseEntity<DepartmentAnalyticsDto> getDepartmentAnalytics() {

        return ResponseEntity.ok(
                studentAnalyticsService.getDepartmentAnalytics()
        );

    }

    // ==========================================
// Placement by CGPA
// ==========================================

    @GetMapping("/placement-cgpa")
    public ResponseEntity<List<CgpaPlacementDto>> getPlacementByCgpa() {

        return ResponseEntity.ok(
                studentAnalyticsService.getPlacementByCgpa()
        );

    }
}