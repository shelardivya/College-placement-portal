package com.college.placement.portal.ai.dto;

public record AiSafePlacementDto(

        Long placementId,
        String studentName,
        String companyName,
        String jobRole,
        String placementStatus,
        Double packageLpa,
        String placementYear

) {
}