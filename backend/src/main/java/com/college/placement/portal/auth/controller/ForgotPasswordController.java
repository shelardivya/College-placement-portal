package com.college.placement.portal.auth.controller;
import com.college.placement.portal.auth.dto.ForgetPasswordDto;
import com.college.placement.portal.auth.dto.ForgotPasswordRequestDto;
import com.college.placement.portal.auth.service.ForgotPasswordService;
import com.college.placement.portal.auth.util.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private EmailService emailService;

    // STEP 1
    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestBody ForgotPasswordRequestDto dto
    ) {
        return forgotPasswordService.sendResetLink(dto.getEmail());
    }

    // STEP 2
    @PostMapping("/reset-password")
    public String resetPassword(
            @Valid @RequestBody ForgetPasswordDto dto
    ) {
        return forgotPasswordService.resetPassword(dto);
    }
    // DEBUG ONLY
    @GetMapping("/test-mail")
    public String testMail() {
        try {
            emailService.sendEmail(
                    "yourpersonalemail@gmail.com",
                    "Test Mail",
                    "If you got this, email config is working"
            );
            return "Mail sent";
        } catch (Exception e) {
            return "Mail error: " + e.getMessage();
        }
    }
}