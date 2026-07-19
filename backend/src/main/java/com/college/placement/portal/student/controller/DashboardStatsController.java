package com.college.placement.portal.student.controller;

import com.college.placement.portal.student.Dto.DashboardStatsDto;
import com.college.placement.portal.student.service.DashboardStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/dashboard")
public class DashboardStatsController {

    private final DashboardStatsService dashboardStatsService;

    public DashboardStatsController(
            DashboardStatsService dashboardStatsService
    ) {
        this.dashboardStatsService = dashboardStatsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {

        return ResponseEntity.ok(
                dashboardStatsService.getDashboardStats()
        );

    }

}