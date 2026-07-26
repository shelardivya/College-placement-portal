package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.RecentPostDto;
import com.college.placement.portal.admin.service.RecentPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class RecentPostController {

    private final RecentPostService recentPostService;

    public RecentPostController(
            RecentPostService recentPostService
    ) {
        this.recentPostService = recentPostService;
    }

    @GetMapping("/recent-posts")
    public ResponseEntity<List<RecentPostDto>> getRecentPosts() {

        return ResponseEntity.ok(
                recentPostService.getRecentPosts()
        );

    }

}