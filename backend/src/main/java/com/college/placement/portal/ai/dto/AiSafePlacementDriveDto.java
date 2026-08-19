package com.college.placement.portal.ai.dto;

public record AiSafePlacementDriveDto(

        Long driveId,
        String companyName,
        String jobRole,
        String location,
        String venue,
        String driveDate,
        String driveTime,
        String status

) {
}