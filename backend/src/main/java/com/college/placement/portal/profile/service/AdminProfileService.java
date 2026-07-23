package com.college.placement.portal.profile.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.profile.Dto.AdminProfileUpdateDto;
import com.college.placement.portal.profile.Dto.AdminProfileViewDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AdminProfileService {

    private final RegisterRepository registerRepository;

    public AdminProfileService(RegisterRepository registerRepository) {
        this.registerRepository = registerRepository;
    }

    // ==========================
    // View Profile
    // ==========================

    public AdminProfileViewDto getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity admin = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Admin not found."));

        AdminProfileViewDto dto = new AdminProfileViewDto();

        dto.setFullName(admin.getFullName());
        dto.setEmail(admin.getEmail());
        dto.setMobile(admin.getMobile());
        dto.setRole(admin.getRole().name());

        return dto;
    }

    // ==========================
    // Update Profile
    // ==========================

    public String updateProfile(AdminProfileUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String currentEmail = authentication.getName();

        RegisterEntity admin = registerRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Admin not found."));

        if (!admin.getEmail().equals(dto.getEmail())
                && registerRepository.existsByEmail(dto.getEmail())) {

            throw new IllegalArgumentException("Email already registered.");
        }

        if (!admin.getMobile().equals(dto.getMobile())
                && registerRepository.existsByMobile(dto.getMobile())) {

            throw new IllegalArgumentException("Mobile number already registered.");
        }

        admin.setFullName(dto.getFullName());
        admin.setEmail(dto.getEmail());
        admin.setMobile(dto.getMobile());

        registerRepository.save(admin);

        return "Profile updated successfully.";
    }
}