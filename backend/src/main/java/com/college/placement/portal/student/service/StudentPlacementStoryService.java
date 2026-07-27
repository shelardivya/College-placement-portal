package com.college.placement.portal.student.service;

import com.college.placement.portal.admin.dto.PlacementStoryResponseDto;
import com.college.placement.portal.admin.entity.PlacementStoryEntity;
import com.college.placement.portal.admin.repository.PlacementStoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentPlacementStoryService {

    private final PlacementStoryRepository placementStoryRepository;

    public StudentPlacementStoryService(
            PlacementStoryRepository placementStoryRepository
    ) {
        this.placementStoryRepository = placementStoryRepository;
    }

    // ==========================================
    // View All Placement Stories
    // ==========================================

    public List<PlacementStoryResponseDto> getAllStories() {

        List<PlacementStoryEntity> stories =
                placementStoryRepository.findAllByOrderByCreatedAtDesc();

        List<PlacementStoryResponseDto> response =
                new ArrayList<>();

        for (PlacementStoryEntity story : stories) {

            PlacementStoryResponseDto dto =
                    new PlacementStoryResponseDto();

            dto.setId(
                    story.getId()
            );

            dto.setStudentId(
                    story.getStudent().getId()
            );

            dto.setStudentName(
                    story.getStudent().getFullName()
            );

            dto.setCompanyName(
                    story.getCompanyName()
            );

            dto.setJobRole(
                    story.getJobRole()
            );

            dto.setPackageLpa(
                    story.getPackageLpa()
            );

            dto.setSuccessStory(
                    story.getSuccessStory()
            );

            dto.setPhotoPath(
                    story.getPhotoPath()
            );

            dto.setCreatedAt(
                    story.getCreatedAt()
            );

            response.add(dto);

        }

        return response;

    }

    // ==========================================
    // View Story By Id
    // ==========================================

    public PlacementStoryResponseDto getStoryById(Long id) {

        PlacementStoryEntity story =
                placementStoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Story not found."));

        PlacementStoryResponseDto dto =
                new PlacementStoryResponseDto();

        dto.setId(story.getId());
        dto.setStudentId(story.getStudent().getId());
        dto.setStudentName(story.getStudent().getFullName());
        dto.setCompanyName(story.getCompanyName());
        dto.setJobRole(story.getJobRole());
        dto.setPackageLpa(story.getPackageLpa());
        dto.setSuccessStory(story.getSuccessStory());
        dto.setPhotoPath(story.getPhotoPath());
        dto.setCreatedAt(story.getCreatedAt());

        return dto;

    }

}