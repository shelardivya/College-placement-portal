package com.college.placement.portal.ai.dto;

public record AiSafeJobDto(

        Long jobId,
        String companyName,
        String jobRequirements,
        String jobRoleOverview,
        String degree,
        String branch,
        Double minimumCgpa,
        String passingYear,
        String experience,
        String location,
        String applicationDeadline,
        String status

) {
}