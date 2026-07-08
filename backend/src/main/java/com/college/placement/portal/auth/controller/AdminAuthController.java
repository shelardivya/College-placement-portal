package com.college.placement.portal.auth.controller;

import com.college.placement.portal.auth.dto.AdminFirstLoginRequest;
import com.college.placement.portal.auth.service.AdminAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;   // ✅ ADD THIS

@RestController
@RequestMapping("/auth/admin")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(   // ✅ ONLY CHANGE
                                                             @Valid @RequestBody AdminFirstLoginRequest request) {

        return ResponseEntity.ok(adminAuthService.adminLogin(request));
    }
}