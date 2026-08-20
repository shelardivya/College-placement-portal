package com.college.placement.portal.ai.service;

import com.college.placement.portal.ai.dto.*;
import com.college.placement.portal.ai.repository.*;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import org.springframework.stereotype.Service;
import com.college.placement.portal.ai.repository.AiPlacementStoryRepository;
import com.college.placement.portal.ai.dto.AiSafePlacementStoryDto;

import java.util.List;

@Service
public class AiSafeDataService {

    private final AiAddJobRepository addJobRepository;
    private final AiPlacementRecordRepository placementRecordRepository;
    private final AiTopPlacedStudentRepository topPlacedStudentRepository;
    private final AiPlacementDriveRepository placementDriveRepository;
    private final AiPlacementStoryRepository placementStoryRepository;
    private final AiJobApplyRepository jobApplyRepository;

    public AiSafeDataService(
            AiAddJobRepository addJobRepository,
            AiPlacementRecordRepository placementRecordRepository,
            AiTopPlacedStudentRepository topPlacedStudentRepository,
            AiPlacementDriveRepository placementDriveRepository,
            AiPlacementStoryRepository placementStoryRepository,
            AiJobApplyRepository jobApplyRepository
    ) {
        this.addJobRepository = addJobRepository;
        this.placementRecordRepository = placementRecordRepository;
        this.topPlacedStudentRepository = topPlacedStudentRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.placementStoryRepository = placementStoryRepository;
        this.jobApplyRepository = jobApplyRepository;
    }

    // =========================================================
    // JOB DATA
    // =========================================================

    public List<AiSafeJobDto> getSafeJobs() {

        return addJobRepository.findAll()
                .stream()
                .map(this::toSafeJob)
                .toList();
    }

    private AiSafeJobDto toSafeJob(AddJobEntity job) {

        return new AiSafeJobDto(
                job.getId(),
                safe(job.getCompanyName()),
                safe(job.getJobRequirements()),
                safe(job.getJobRoleOverview()),
                safe(job.getDegree()),
                safe(job.getBranch()),
                job.getMinCgpa(),
                safe(job.getPassingYear()),
                safe(job.getExperience()),
                safe(job.getLocation()),
                job.getDeadline() != null
                        ? job.getDeadline().toString()
                        : null,
                safe(job.getStatus())
        );
    }

    // =========================================================
    // PLACEMENT DATA
    // =========================================================

    public List<AiSafePlacementDto> getSafePlacements() {

        return placementRecordRepository.findAll()
                .stream()
                .map(this::toSafePlacement)
                .toList();
    }

    private AiSafePlacementDto toSafePlacement(
            PlacementRecordEntity placement
    ) {

        String studentName = "Student";

        if (placement.getStudent() != null) {
            studentName = safe(
                    placement.getStudent().getFullName()
            );
        }

        return new AiSafePlacementDto(
                placement.getId(),
                studentName,
                safe(placement.getCompanyName()),
                safe(placement.getJobRole()),
                safe(placement.getStatus()),
                placement.getPackageLpa(),
                placement.getPlacementDate() != null
                        ? String.valueOf(
                        placement.getPlacementDate().getYear()
                )
                        : null
        );
    }

    // =========================================================
    // TOP PLACED STUDENTS
    // =========================================================

    public List<AiSafeTopPlacedStudentDto> getSafeTopPlacedStudents() {

        return topPlacedStudentRepository.findAll()
                .stream()
                .map(student -> new AiSafeTopPlacedStudentDto(
                        safe(student.getStudentName()),
                        safe(student.getCompanyName()),
                        student.getPackageLpa(),
                        student.getCgpa(),
                        safe(student.getSkills()),
                        safe(student.getBranch()),
                        safe(student.getPassingYear())
                ))
                .toList();
    }
    // =========================================================
    // Placement Drive
    // =========================================================
    public List<AiSafePlacementDriveDto> getSafePlacementDrives() {

        return placementDriveRepository.findAll()
                .stream()
                .map(drive -> new AiSafePlacementDriveDto(
                        drive.getId(),
                        safe(drive.getCompanyName()),
                        safe(drive.getJobRole()),
                        safe(drive.getLocation()),
                        safe(drive.getVenue()),
                        drive.getDriveDate() != null
                                ? drive.getDriveDate().toString()
                                : null,
                        drive.getDriveTime() != null
                                ? drive.getDriveTime().toString()
                                : null,
                        safe(drive.getStatus())
                ))
                .toList();
    }
    // =========================================================
    // Placement story
    // =========================================================
    public List<AiSafePlacementStoryDto> getSafePlacementStories() {

        return placementStoryRepository.findAll()
                .stream()
                .map(story -> new AiSafePlacementStoryDto(
                        story.getId(),
                        safe(story.getCompanyName()),
                        safe(story.getJobRole()),
                        story.getPackageLpa(),
                        safe(story.getSuccessStory())
                ))
                .toList();
    }
    // =========================================================
    // JOB apply
    // =========================================================
    public List<AiSafeJobApplicationDto> getSafeJobApplications() {

        return jobApplyRepository.findAll()
                .stream()
                .map(application -> {

                    String companyName = "Not available";
                    String jobRole = "Not available";

                    if (application.getJob() != null) {
                        companyName = safe(
                                application.getJob().getCompanyName()
                        );

                        jobRole = safe(
                                application.getJob().getJobRoleOverview()
                        );
                    }

                    return new AiSafeJobApplicationDto(
                            application.getId(),
                            companyName,
                            jobRole,
                            safe(application.getStatus()),
                            application.getMatchPercentage(),
                            application.getAppliedAt() != null
                                    ? application.getAppliedAt().toString()
                                    : null
                    );
                })
                .toList();
    }

    // =========================================================
    // NULL HANDLING
    // =========================================================

    private String safe(String value) {

        return value == null
                ? "Not available"
                : value;
    }
}