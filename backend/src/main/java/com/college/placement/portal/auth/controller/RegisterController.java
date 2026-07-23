package com.college.placement.portal.auth.controller;
import com.college.placement.portal.auth.dto.RegisterDto;
import com.college.placement.portal.auth.service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(
            @Valid @RequestBody RegisterDto request
    ) {
        String token = registerService.registerStudent(request);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Student registered successfully",
                        "token", token
                )
        );
    }
}
