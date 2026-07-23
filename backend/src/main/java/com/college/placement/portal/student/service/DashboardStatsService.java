package com.college.placement.portal.student.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.student.Dto.DashboardStatsDto;
import com.college.placement.portal.student.repository.JobApplyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class DashboardStatsService {

    private final RegisterRepository registerRepository;
    private final JobApplyRepository jobApplyRepository;

    public DashboardStatsService(RegisterRepository registerRepository,
                                 JobApplyRepository jobApplyRepository) {

        this.registerRepository = registerRepository;
        this.jobApplyRepository = jobApplyRepository;
    }

    public DashboardStatsDto getDashboardStats() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        DashboardStatsDto dto = new DashboardStatsDto();

        // ===========================
        // Welcome Name
        // ===========================

        dto.setFullName(student.getFullName());

        // ===========================
        // Current Day
        // ===========================

        LocalDate today = LocalDate.now();

        dto.setCurrentDay(
                today.getDayOfWeek()
                        .getDisplayName(
                                java.time.format.TextStyle.FULL,
                                Locale.ENGLISH
                        )
        );

        // ===========================
        // Current Date
        // ===========================

        dto.setCurrentDate(
                today.format(
                        DateTimeFormatter.ofPattern("dd-MM-yyyy")
                )
        );

        // ===========================
        // Profile Completion
        // ===========================

        int totalFields = 10;
        int completed = 0;

        if (student.getFullName() != null && !student.getFullName().isBlank())
            completed++;

        if (student.getEmail() != null && !student.getEmail().isBlank())
            completed++;

        if (student.getMobile() != null && !student.getMobile().isBlank())
            completed++;

        if (student.getCourse() != null && !student.getCourse().isBlank())
            completed++;

        if (student.getDepartment() != null && !student.getDepartment().isBlank())
            completed++;

        if (student.getCurrentYear() != null && !student.getCurrentYear().isBlank())
            completed++;

        if (student.getCgpa() != null)
            completed++;

        if (student.getSkills() != null && !student.getSkills().isBlank())
            completed++;

        if (student.getLinkedinUrl() != null && !student.getLinkedinUrl().isBlank())
            completed++;

        if (student.getGithubUrl() != null && !student.getGithubUrl().isBlank())
            completed++;

        dto.setProfileCompleted((completed * 100) / totalFields);

        // ===========================
        // Status Cards
        // ===========================

        dto.setSelected(
                jobApplyRepository.countByStudentAndStatusIgnoreCase(
                        student,
                        "SELECTED"
                )
        );

        dto.setPending(
                jobApplyRepository.countByStudentAndStatusIgnoreCase(
                        student,
                        "PENDING"
                )
        );

        dto.setRejected(
                jobApplyRepository.countByStudentAndStatusIgnoreCase(
                        student,
                        "REJECTED"
                )
        );

        return dto;
    }
}