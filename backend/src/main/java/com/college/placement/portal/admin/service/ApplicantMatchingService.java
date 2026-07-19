package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.ApplicantMatchingDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.ApplicantMatchingRepository;
import com.college.placement.portal.student.entity.JobApplyEntity;
import com.college.placement.portal.student.util.ResumeMatcher;
import com.college.placement.portal.student.util.ResumeParser;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicantMatchingService {

    private final ApplicantMatchingRepository repository;
    private final ResumeParser resumeParser;
    private final ResumeMatcher resumeMatcher;

    public ApplicantMatchingService(
            ApplicantMatchingRepository repository,
            ResumeParser resumeParser,
            ResumeMatcher resumeMatcher
    ) {

        this.repository = repository;
        this.resumeParser = resumeParser;
        this.resumeMatcher = resumeMatcher;
    }

    // ==========================================
    // Applicant Matching
    // ==========================================

    public List<ApplicantMatchingDto> getApplicants() {

        List<JobApplyEntity> applications =
                repository.findAllByOrderByAppliedAtDesc();

        List<ApplicantMatchingDto> response =
                new ArrayList<>();

        for (JobApplyEntity application : applications) {

            AddJobEntity job = application.getJob();

            String resumeText =
                    resumeParser.extractText(
                            application.getResumePath()
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

            int percentage =
                    resumeMatcher.calculateMatchPercentage(
                            resumeText,
                            jobText
                    );

            ApplicantMatchingDto dto =
                    new ApplicantMatchingDto();

            dto.setCompanyName(
                    job.getCompanyName()
            );

            dto.setStudentName(
                    application.getStudent().getFullName()
            );

            dto.setDepartment(
                    application.getStudent().getDepartment()
            );

            dto.setCourse(
                    application.getStudent().getCourse()
            );

            dto.setCgpa(
                    application.getStudent().getCgpa()
            );

            dto.setPassingYear(
                    job.getPassingYear()
            );

            dto.setAppliedAt(
                    application.getAppliedAt()
            );

            dto.setMatchPercentage(
                    percentage
            );

            response.add(dto);

        }

        return response;

    }

}