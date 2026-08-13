package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.CgpaPlacementDto;
import com.college.placement.portal.admin.dto.DepartmentAnalyticsDto;
import com.college.placement.portal.admin.dto.StudentAnalyticsDto;
import com.college.placement.portal.admin.dto.TopPlacedStudentResponseDto;
import com.college.placement.portal.admin.dto.TopSkillDto;
import com.college.placement.portal.admin.service.StudentAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student/placeview")
public class StudentPlaceviewController {

    private final StudentAnalyticsService studentAnalyticsService;

    public StudentPlaceviewController(
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
    // Placement By CGPA
    // ==========================================

    @GetMapping("/placement-cgpa")
    public ResponseEntity<List<CgpaPlacementDto>> getPlacementByCgpa() {

        return ResponseEntity.ok(
                studentAnalyticsService.getPlacementByCgpa()
        );
    }

    // ==========================================
    // Top Skills In Demand
    // ==========================================

    @GetMapping("/top-skills")
    public ResponseEntity<List<TopSkillDto>> getTopSkills() {

        return ResponseEntity.ok(
                studentAnalyticsService.getTopSkills()
        );
    }

    // ==========================================
    // Top Placed Students
    // ==========================================

    @GetMapping("/top-placed")
    public ResponseEntity<List<TopPlacedStudentResponseDto>>
    getTopPlacedStudents() {

        return ResponseEntity.ok(
                studentAnalyticsService
                        .getTopPlacedStudentsForStudentView()
        );
    }
}