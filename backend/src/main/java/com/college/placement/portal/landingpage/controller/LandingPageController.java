package com.college.placement.portal.landingpage.controller;

import com.college.placement.portal.landingpage.dto.LandingStatsDto;
import com.college.placement.portal.landingpage.dto.PlacementTrendDto;
import com.college.placement.portal.landingpage.dto.RecentJobDto;
import com.college.placement.portal.landingpage.service.LandingPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/landing")
public class LandingPageController {

    private final LandingPageService landingPageService;

    public LandingPageController(LandingPageService landingPageService) {
        this.landingPageService = landingPageService;
    }

    // ==========================================
    // Public Stats — Total Students / Placements / Companies / Rate
    // ==========================================

    @GetMapping("/stats")
    public ResponseEntity<LandingStatsDto> getPublicStats() {

        return ResponseEntity.ok(
                landingPageService.getPublicStats()
        );

    }

    // ==========================================
    // Placement Trend Chart (last 7 months)
    // ==========================================

    @GetMapping("/placement-trend")
    public ResponseEntity<List<PlacementTrendDto>> getPlacementTrend() {

        return ResponseEntity.ok(
                landingPageService.getPlacementTrend()
        );

    }

    // ==========================================
    // Recent Activity Feed (latest 3 active jobs)
    // ==========================================

    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentJobDto>> getRecentActivity() {

        return ResponseEntity.ok(
                landingPageService.getRecentActivity()
        );

    }

}