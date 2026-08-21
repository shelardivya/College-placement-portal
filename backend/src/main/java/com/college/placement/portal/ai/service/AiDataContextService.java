package com.college.placement.portal.ai.service;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.entity.PlacementDriveEntity;
import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import com.college.placement.portal.admin.entity.PlacementStoryEntity;
import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import com.college.placement.portal.ai.repository.AiAddJobRepository;
import com.college.placement.portal.ai.repository.AiJobApplyRepository;
import com.college.placement.portal.ai.repository.AiPlacementDriveRepository;
import com.college.placement.portal.ai.repository.AiPlacementRecordRepository;
import com.college.placement.portal.ai.repository.AiPlacementStoryRepository;
import com.college.placement.portal.ai.repository.AiTopPlacedStudentRepository;
import org.springframework.stereotype.Service;

@Service
public class AiDataContextService {

    private final AiAddJobRepository addJobRepository;
    private final AiPlacementRecordRepository placementRecordRepository;
    private final AiTopPlacedStudentRepository topPlacedStudentRepository;
    private final AiPlacementDriveRepository placementDriveRepository;
    private final AiPlacementStoryRepository placementStoryRepository;
    private final AiJobApplyRepository jobApplyRepository;

    public AiDataContextService(
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

// =====================================================
// STUDENT CONTEXT
// =====================================================

    public String buildStudentContext(Long studentId) {

        StringBuilder context = new StringBuilder();

        context.append("""
            
            ================================
            CAMPUSHIRE STUDENT PORTAL DATA
            ================================
            """);
        addTodayDate(context);

        // Jobs visible to students
        addJobData(context);

        // Placement records
        // Student names are visible to both STUDENT and ADMIN
        addPlacementRecordData(context);

        // Top placed students
        // Student names are visible to both STUDENT and ADMIN
        addTopPlacedStudentData(context);

        // Placement drives
        addPlacementDriveData(context);

        // Placement stories
        addPlacementStoryData(context);

        // IMPORTANT:
        // Only the currently logged-in student's applications
        // will be added here.
        addStudentJobApplicationData(context, studentId);

        return context.toString();
    }

    // =====================================================
    // ADMIN CONTEXT
    // =====================================================

    public String buildAdminContext() {

        StringBuilder context = new StringBuilder();

        context.append("""
                
                =================================
                CAMPUSHIRE ADMIN PORTAL DATA
                =================================
                """);
        addTodayDate(context);

        addJobData(context);

        addPlacementRecordData(context);

        addTopPlacedStudentData(context);

        addPlacementDriveData(context);

        addPlacementStoryData(context);

        addJobApplicationData(context);

        return context.toString();
    }

    // =====================================================
    // JOB POSTINGS
    // =====================================================

    private void addJobData(StringBuilder context) {

        context.append("\nAVAILABLE JOB POSTINGS:\n");

        for (AddJobEntity job : addJobRepository.findAll()) {

            context.append("""
                    Job ID: %s
                    Company: %s
                    Requirements: %s
                    Role Overview: %s
                    Degree: %s
                    Branch: %s
                    Minimum CGPA: %s
                    Passing Year: %s
                    Experience: %s
                    Location: %s
                    Deadline: %s
                    Status: %s

                    """.formatted(
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
                            : "Not available",
                    safe(job.getStatus())
            ));
        }
    }

    // =====================================================
    // PLACEMENT RECORDS
    // =====================================================

    private void addPlacementRecordData(StringBuilder context) {

        context.append("\nPLACEMENT RECORDS:\n");

        for (PlacementRecordEntity placement :
                placementRecordRepository.findAll()) {

            String studentName = "Student";

            if (placement.getStudent() != null) {

                studentName = safe(
                        placement.getStudent().getFullName()
                );
            }

            context.append("""
                    Placement ID: %s
                    Student: %s
                    Company: %s
                    Job Role: %s
                    Status: %s
                    Package LPA: %s
                    Placement Year: %s

                    """.formatted(
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
                            : "Not available"
            ));
        }
    }

    // =====================================================
    // TOP PLACED STUDENTS
    // =====================================================

    private void addTopPlacedStudentData(StringBuilder context) {

        context.append("\nTOP PLACED STUDENTS:\n");

        for (TopPlacedStudentEntity student :
                topPlacedStudentRepository.findAll()) {

            context.append("""
                    Student: %s
                    Company: %s
                    Package LPA: %s
                    CGPA: %s
                    Skills: %s
                    Branch: %s
                    Passing Year: %s

                    """.formatted(
                    safe(student.getStudentName()),
                    safe(student.getCompanyName()),
                    student.getPackageLpa(),
                    student.getCgpa(),
                    safe(student.getSkills()),
                    safe(student.getBranch()),
                    safe(student.getPassingYear())
            ));
        }
    }

    // =====================================================
    // PLACEMENT DRIVES
    // =====================================================

    private void addPlacementDriveData(StringBuilder context) {

        context.append("\nPLACEMENT DRIVES:\n");

        for (PlacementDriveEntity drive :
                placementDriveRepository.findAll()) {

            context.append("""
                    Drive ID: %s
                    Company: %s
                    Job Role: %s
                    Location: %s
                    Status: %s
                    Drive Date: %s
                    Drive Time: %s

                    """.formatted(
                    drive.getId(),
                    safe(drive.getCompanyName()),
                    safe(drive.getJobRole()),
                    safe(drive.getLocation()),
                    safe(drive.getStatus()),
                    drive.getDriveDate() != null
                            ? drive.getDriveDate().toString()
                            : "Not available",
                    drive.getDriveTime() != null
                            ? drive.getDriveTime().toString()
                            : "Not available"
            ));
        }
    }

    // =====================================================
    // PLACEMENT STORIES
    // =====================================================

    private void addPlacementStoryData(StringBuilder context) {

        context.append("\nPLACEMENT STORIES:\n");

        for (PlacementStoryEntity story :
                placementStoryRepository.findAll()) {

            context.append("""
        Placement Story
        Student: %s
        Company: %s
        Job Role: %s
        Package LPA: %s
        Success Story: %s

        """.formatted(
                    story.getStudent() != null
                            ? safe(story.getStudent().getFullName())
                            : "Not available",
                    safe(story.getCompanyName()),
                    safe(story.getJobRole()),
                    story.getPackageLpa(),
                    safe(story.getSuccessStory())
            ));
        }
    }
// =====================================================
// STUDENT JOB APPLICATIONS
// ONLY CURRENTLY LOGGED-IN STUDENT
// =====================================================

    private void addStudentJobApplicationData(
            StringBuilder context,
            Long studentId
    ) {

        context.append("\nMY JOB APPLICATIONS:\n");

        jobApplyRepository.findByStudent_Id(studentId)
                .forEach(application -> {

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

                    context.append("""
                    Application ID: %s
                    Company: %s
                    Job Role: %s
                    Application Status: %s
                    Match Percentage: %s
                    Applied At: %s

                    """.formatted(
                            application.getId(),
                            companyName,
                            jobRole,
                            safe(application.getStatus()),
                            application.getMatchPercentage(),
                            application.getAppliedAt() != null
                                    ? application.getAppliedAt().toString()
                                    : "Not available"
                    ));
                });
    }
    // =====================================================
    // JOB APPLICATIONS
    // ADMIN ONLY
    // =====================================================

    private void addJobApplicationData(StringBuilder context) {

        context.append("\nJOB APPLICATIONS:\n");

        jobApplyRepository.findAll()
                .forEach(application -> {

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

                    context.append("""
                            Application ID: %s
                            Company: %s
                            Job Role: %s
                            Application Status: %s
                            Match Percentage: %s
                            Applied At: %s

                            """.formatted(
                            application.getId(),
                            companyName,
                            jobRole,
                            safe(application.getStatus()),
                            application.getMatchPercentage(),
                            application.getAppliedAt() != null
                                    ? application.getAppliedAt().toString()
                                    : "Not available"
                    ));
                });
    }

    // =====================================================
    // SAFE NULL HANDLING
    // =====================================================

    private String safe(String value) {

        return value == null
                ? "Not available"
                : value;
    }
    // =====================================================
    // TODAY'S DATE
    // =====================================================

    private void addTodayDate(StringBuilder context) {

        context.append("\nTODAY'S DATE: ")
                .append(
                        java.time.LocalDate.now().format(
                                java.time.format.DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy",
                                        java.util.Locale.ENGLISH
                                )
                        )
                )
                .append("\n");
    }
}