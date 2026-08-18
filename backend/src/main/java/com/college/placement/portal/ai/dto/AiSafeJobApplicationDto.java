package com.college.placement.portal.ai.dto;

public record AiSafeJobApplicationDto(

        Long applicationId,
        String companyName,
        String jobRole,
        String applicationStatus,
        Integer matchPercentage,
        String appliedAt

) {
}