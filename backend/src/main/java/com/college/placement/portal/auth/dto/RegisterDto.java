package com.college.placement.portal.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterDto {

    @NotBlank
    private String fullName;

    @Email(message = "Invalid email id")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid mobile number")
    private String mobile;

    @Pattern(
            regexp = "^\\d{2}-\\d{2}-\\d{4}$",
            message = "DOB must be in dd-MM-yyyy format"
    )
    private String dob;

    @NotBlank
    private String department;

    @NotBlank
    private String course;

    @NotBlank
    private String currentYear;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    private Double cgpa;

    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            message = "Password must be at least 8 characters and contain at least one letter, one number and one special character."
    )
    private String password;

    private String confirmPassword;

    private boolean rememberMe;
}
