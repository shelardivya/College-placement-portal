package com.college.placement.portal.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AdminFirstLoginRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number and one special character."
    )
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    // ✅ ADD THIS
    private boolean rememberMe;

    // getters

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    // ✅ ADD THIS
    public boolean isRememberMe() {
        return rememberMe;
    }

    // setters

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    // ✅ ADD THIS
    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}