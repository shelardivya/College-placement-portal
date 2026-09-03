package com.college.placement.portal.ai.dto;

public record AiSafePlacementStoryDto(

        Long storyId,
        String companyName,
        String jobRole,
        Double packageLpa,
        String successStory

) {
}