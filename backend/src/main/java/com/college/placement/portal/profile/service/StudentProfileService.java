package com.college.placement.portal.profile.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.profile.Dto.StudentProfileUpdateDto;
import com.college.placement.portal.profile.Dto.StudentProfileViewDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class StudentProfileService {

    private final RegisterRepository registerRepository;

    public StudentProfileService(RegisterRepository registerRepository) {
        this.registerRepository = registerRepository;
    }

    // ===========================
    // View Profile
    // ===========================

    public StudentProfileViewDto getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        StudentProfileViewDto dto = new StudentProfileViewDto();

        dto.setFullName(student.getFullName());
        dto.setEmail(student.getEmail());
        dto.setMobile(student.getMobile());
        dto.setRole(student.getRole().name());

        dto.setCourse(student.getCourse());
        dto.setDepartment(student.getDepartment());
        dto.setCurrentYear(student.getCurrentYear());
        dto.setCgpa(student.getCgpa());

        dto.setSkills(student.getSkills());
        dto.setLinkedinUrl(student.getLinkedinUrl());
        dto.setGithubUrl(student.getGithubUrl());

        return dto;
    }

    // ===========================
    // Update Profile
    // ===========================

    public String updateProfile(StudentProfileUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        if (!student.getEmail().equals(dto.getEmail())
                && registerRepository.existsByEmail(dto.getEmail())) {

            throw new IllegalArgumentException("Email already registered.");
        }

        if (!student.getMobile().equals(dto.getMobile())
                && registerRepository.existsByMobile(dto.getMobile())) {

            throw new IllegalArgumentException("Mobile number already registered.");
        }

        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setMobile(dto.getMobile());

        student.setCourse(dto.getCourse());
        student.setDepartment(dto.getDepartment());
        student.setCurrentYear(dto.getCurrentYear());
        student.setCgpa(dto.getCgpa());

        student.setSkills(dto.getSkills());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setGithubUrl(dto.getGithubUrl());

        registerRepository.save(student);

        return "Profile updated successfully.";
    }

}