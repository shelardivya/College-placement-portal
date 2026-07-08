package com.college.placement.portal.auth.controller;

import com.college.placement.portal.auth.dto.LoginRequest;
import com.college.placement.portal.auth.dto.LoginResponse;
import com.college.placement.portal.auth.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(loginService.login(request));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok(loginService.logout());
    }
}