package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.DraftDto;
import com.college.placement.portal.admin.dto.DraftResponseDto;
import com.college.placement.portal.admin.dto.DraftUpdateDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DraftService {

    private final AddJobRepository repository;

    public DraftService(AddJobRepository repository) {
        this.repository = repository;
    }

    public DraftResponseDto getAllDrafts() {

        List<AddJobEntity> draftEntities =
                repository.findByStatusOrderByCreatedAtDesc("DRAFT");

        List<DraftDto> draftDtos = new ArrayList<>();

        for (AddJobEntity job : draftEntities) {

            DraftDto dto = new DraftDto();

            dto.setId(job.getId());
            dto.setCompanyName(job.getCompanyName());
            dto.setJobRoleOverview(job.getJobRoleOverview());
            dto.setStatus(job.getStatus());
            dto.setSavedTime(getSavedTime(job.getCreatedAt()));

            draftDtos.add(dto);
        }

        long count = repository.countByStatus("DRAFT");

        return new DraftResponseDto(count, draftDtos);
    }

    // =====================================
    // Saved Time Calculator
    // =====================================

    private String getSavedTime(LocalDateTime createdAt) {

        Duration duration =
                Duration.between(createdAt, LocalDateTime.now());

        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return minutes + " minutes ago";
        }

        if (hours < 24) {
            return hours + " hours ago";
        }

        return days + " days ago";
    }
    public AddJobEntity getDraftById(Long id) {

        return repository
                .findByIdAndStatus(id, "DRAFT")
                .orElseThrow(() ->
                        new RuntimeException("Draft not found"));
    }
    public AddJobEntity updateDraft(Long id, DraftUpdateDto dto) {

        AddJobEntity job = repository
                .findByIdAndStatus(id, "DRAFT")
                .orElseThrow(() ->
                        new RuntimeException("Draft not found"));

        job.setCompanyName(dto.getCompanyName());
        job.setJobRequirements(dto.getJobRequirements());
        job.setJobRoleOverview(dto.getJobRoleOverview());

        job.setDegree(dto.getDegree());
        job.setBranch(dto.getBranch());
        job.setMinCgpa(dto.getMinCgpa());
        job.setPassingYear(dto.getPassingYear());
        job.setExperience(dto.getExperience());
        job.setLocation(dto.getLocation());
        job.setDeadline(dto.getDeadline());

        return repository.save(job);
    }
    @Transactional
    public AddJobEntity publishDraft(Long id) {

        AddJobEntity draft = repository
                .findByIdAndStatus(id, "DRAFT")
                .orElseThrow(() ->
                        new RuntimeException("Draft not found"));

        draft.setStatus("ACTIVE");

        return repository.save(draft);
    }

}