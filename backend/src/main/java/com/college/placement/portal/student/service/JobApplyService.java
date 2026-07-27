package com.college.placement.portal.student.service;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.exception.DuplicateResourceException;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.util.NotificationHelper;
import com.college.placement.portal.student.Dto.JobDetailsDto;
import com.college.placement.portal.student.Dto.LatestJobDto;
import com.college.placement.portal.student.entity.JobApplyEntity;
import com.college.placement.portal.student.repository.JobApplyRepository;
import com.college.placement.portal.student.util.ResumeMatcher;
import com.college.placement.portal.student.util.ResumeParser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class JobApplyService {

    private final AddJobRepository repository;
    private final RegisterRepository registerRepository;
    private final JobApplyRepository jobApplyRepository;
    private final ResumeParser resumeParser;
    private final ResumeMatcher resumeMatcher;
    private final NotificationHelper notificationHelper;

    public JobApplyService(AddJobRepository repository,
                           RegisterRepository registerRepository,
                           JobApplyRepository jobApplyRepository,
                           ResumeParser resumeParser,
                           ResumeMatcher resumeMatcher,
                           NotificationHelper notificationHelper) {

        this.repository = repository;
        this.registerRepository = registerRepository;
        this.jobApplyRepository = jobApplyRepository;
        this.resumeParser = resumeParser;
        this.resumeMatcher = resumeMatcher;
        this.notificationHelper = notificationHelper;
    }

    // ====================================================
    // Latest Active Jobs
    // ====================================================

    public List<LatestJobDto> getLatestJobs() {

        List<AddJobEntity> jobs =
                repository.findByStatusAndDeadlineGreaterThanEqualOrderByCreatedAtDesc(
                        "ACTIVE",
                        LocalDate.now()
                );

        List<LatestJobDto> response = new ArrayList<>();

        for (AddJobEntity job : jobs) {

            LatestJobDto dto = new LatestJobDto();

            dto.setId(job.getId());
            dto.setCompanyName(job.getCompanyName());
            dto.setLocation(job.getLocation());
            dto.setJobRoleOverview(job.getJobRoleOverview());
            dto.setDeadline(job.getDeadline());

            response.add(dto);
        }

        return response;
    }

    // ====================================================
    // Job Details
    // ====================================================

    public JobDetailsDto getJobDetails(Long id) {

        AddJobEntity job = repository
                .findByIdAndStatus(id, "ACTIVE")
                .orElseThrow(() ->
                        new IllegalArgumentException("Job not found."));

        if (job.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Application deadline has expired.");
        }

        JobDetailsDto dto = new JobDetailsDto();

        dto.setId(job.getId());
        dto.setCompanyName(job.getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setJobRequirements(job.getJobRequirements());
        dto.setJobRoleOverview(job.getJobRoleOverview());

        dto.setDegree(job.getDegree());
        dto.setBranch(job.getBranch());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setPassingYear(job.getPassingYear());
        dto.setExperience(job.getExperience());

        dto.setDeadline(job.getDeadline());

        return dto;
    }

    // ====================================================
    // Apply Job
    // ====================================================

    public String applyJob(Long jobId,
                           MultipartFile resume) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        AddJobEntity job =
                repository.findByIdAndStatus(jobId, "ACTIVE")
                        .orElseThrow(() ->
                                new IllegalArgumentException("Job not found."));

        if (job.getDeadline().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Application deadline has expired.");
        }

        if (jobApplyRepository.existsByStudentAndJob(student, job)) {
            throw new DuplicateResourceException(
                    "You have already applied for this job."
            );
        }

        if (resume == null || resume.isEmpty()) {
            throw new IllegalArgumentException("Resume is required.");
        }

        String originalFileName = resume.getOriginalFilename();

        if (originalFileName == null ||
                !originalFileName.toLowerCase().endsWith(".pdf")) {

            throw new IllegalArgumentException("Only PDF file is allowed.");
        }

        if (resume.getSize() > (5 * 1024 * 1024)) {
            throw new IllegalArgumentException("Maximum file size is 5 MB.");
        }

        String uploadDir = System.getProperty("user.dir")
                + File.separator
                + "uploads"
                + File.separator
                + "resumes";

        File folder = new File(uploadDir);

        if (!folder.exists()) {
            folder.mkdirs();
        }

        String uniqueFileName =
                UUID.randomUUID() + "_" + originalFileName;

        File destination = new File(folder, uniqueFileName);

        resume.transferTo(destination.getAbsoluteFile());
        // ===========================================
// Resume Match Percentage
// ===========================================

        String resumeText =
                resumeParser.extractText(
                        destination.getAbsolutePath()
                );

        String jobText =
                (job.getJobRequirements() == null ? "" : job.getJobRequirements())
                        + " "
                        + (job.getJobRoleOverview() == null ? "" : job.getJobRoleOverview())
                        + " "
                        + (job.getDegree() == null ? "" : job.getDegree())
                        + " "
                        + (job.getBranch() == null ? "" : job.getBranch())
                        + " "
                        + (job.getExperience() == null ? "" : job.getExperience());

        int resumeMatch =
                resumeMatcher.calculateMatchPercentage(
                        resumeText,
                        jobText
                );
        // ===========================================
// AI Scoring Logic
// ===========================================

        int score = resumeMatch;
        System.out.println("Resume Match = " + resumeMatch);
        System.out.println("Final Score = " + score);


// CGPA Match (+5)

        if (student.getCgpa() != null &&
                job.getMinCgpa() != null &&
                student.getCgpa() >= job.getMinCgpa()) {

            score += 5;

        }

// Degree Match (+5)

        if (student.getCourse() != null &&
                job.getDegree() != null &&
                student.getCourse().equalsIgnoreCase(job.getDegree())) {

            score += 5;

        }

// Branch Match (+5)

        if (student.getDepartment() != null &&
                job.getBranch() != null &&
                student.getDepartment().equalsIgnoreCase(job.getBranch())) {

            score += 5;

        }

// Passing Year / Current Year (+5)

        if (student.getCurrentYear() != null &&
                job.getPassingYear() != null &&
                student.getCurrentYear().equalsIgnoreCase(job.getPassingYear())) {

            score += 5;

        }

// Experience (+5)

        if (job.getExperience() != null &&
                job.getExperience().equalsIgnoreCase("Fresher")) {

            score += 5;

        }

// Maximum Score = 100

        if (score > 100) {
            score = 100;
        }
        System.out.println("========================");
        System.out.println("Resume Match = " + resumeMatch);
        System.out.println("Final Score = " + score);
        System.out.println("========================");
        JobApplyEntity application =
                new JobApplyEntity();

        application.setStudent(student);

        application.setJob(job);

        application.setResumeName(originalFileName);

        application.setResumePath(destination.getAbsolutePath());

// Save Match Percentage
        application.setMatchPercentage(score);

// Auto Status

        if (score >= 70) {

            application.setStatus("SELECTED");

        }
        else if (score >= 50) {

            application.setStatus("PENDING");

        }
        else {

            application.setStatus("REJECTED");

        }

        jobApplyRepository.save(application);
        notificationHelper.createNotification(
                null,
                "ADMIN",
                "New Job Application",
                student.getFullName()
                        + " applied for "
                        + job.getCompanyName()
                        + " - "
                        + job.getJobRoleOverview()
        );

        return "Application submitted successfully.";
    }

}