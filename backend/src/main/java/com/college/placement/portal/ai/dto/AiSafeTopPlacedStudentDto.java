package com.college.placement.portal.ai.dto;

public record AiSafeTopPlacedStudentDto(

        String studentName,
        String companyName,
        Double packageLpa,
        Double cgpa,
        String skills,
        String branch,
        String passingYear

) {
}