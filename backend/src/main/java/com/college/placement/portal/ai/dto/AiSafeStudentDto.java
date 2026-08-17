package com.college.placement.portal.ai.dto;

public record AiSafeStudentDto(

        String fullName,
        String course,
        String department,
        String currentYear,
        Double cgpa,
        String skills,
        String placementStatus

) {
}