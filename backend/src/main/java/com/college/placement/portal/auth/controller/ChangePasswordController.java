package com.college.placement.portal.auth.controller;

import com.college.placement.portal.auth.dto.ChangePasswordDto;
import com.college.placement.portal.auth.service.ChangePasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ChangePasswordController {

    private final ChangePasswordService changePasswordService;

    public ChangePasswordController(
            ChangePasswordService changePasswordService
    ) {
        this.changePasswordService = changePasswordService;
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordDto dto
    ) {

        return ResponseEntity.ok(
                changePasswordService.changePassword(dto)
        );

    }

}