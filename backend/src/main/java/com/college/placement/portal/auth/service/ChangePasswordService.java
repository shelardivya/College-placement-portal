package com.college.placement.portal.auth.service;

import com.college.placement.portal.auth.dto.ChangePasswordDto;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ChangePasswordService {

    private final RegisterRepository registerRepository;
    private final PasswordEncoder passwordEncoder;

    public ChangePasswordService(RegisterRepository registerRepository,
                                 PasswordEncoder passwordEncoder) {
        this.registerRepository = registerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String changePassword(ChangePasswordDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity user = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));

        // ==========================
        // Current Password Check
        // ==========================

        if (!passwordEncoder.matches(
                dto.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "Current password is incorrect."
            );

        }

        // ==========================
        // Password Policy
        // ==========================

        String passwordRegex =
                "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&^#()_+\\-=]).{8,}$";

        if (!dto.getNewPassword().matches(passwordRegex)) {

            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
            );

        }

        // ==========================
        // Confirm Password Check
        // ==========================

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "New password and Confirm password do not match."
            );

        }

        // ==========================
        // Same Password Check
        // ==========================

        if (passwordEncoder.matches(
                dto.getNewPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "New password cannot be the same as current password."
            );

        }

        // ==========================
        // Update Password
        // ==========================

        user.setPassword(
                passwordEncoder.encode(dto.getNewPassword())
        );

        registerRepository.save(user);

        return "Password changed successfully.";
    }

}