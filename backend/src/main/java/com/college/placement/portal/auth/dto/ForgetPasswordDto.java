package com.college.placement.portal.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ForgetPasswordDto {

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @NotBlank(message = "New Password is required")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&^#()_+\\-=]).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one letter, one number and one special character."
    )
    private String newPassword;

    @NotBlank(message = "Confirm Password is required")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&^#()_+\\-=]).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one letter, one number and one special character."
    )
    private String confirmPassword;
}