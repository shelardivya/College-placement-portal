package com.college.placement.portal.student.service;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.student.Dto.ResumeMatchDto;
import com.college.placement.portal.student.entity.JobApplyEntity;
import com.college.placement.portal.student.repository.JobApplyRepository;
import com.college.placement.portal.student.util.ResumeMatcher;
import com.college.placement.portal.student.util.ResumeParser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResumeMatchService {

    private final RegisterRepository registerRepository;

    private final JobApplyRepository jobApplyRepository;

    private final AddJobRepository addJobRepository;

    private final ResumeParser resumeParser;

    private final ResumeMatcher resumeMatcher;

    public ResumeMatchService(RegisterRepository registerRepository,
                              JobApplyRepository jobApplyRepository,
                              AddJobRepository addJobRepository,
                              ResumeParser resumeParser,
                              ResumeMatcher resumeMatcher) {

        this.registerRepository = registerRepository;
        this.jobApplyRepository = jobApplyRepository;
        this.addJobRepository = addJobRepository;
        this.resumeParser = resumeParser;
        this.resumeMatcher = resumeMatcher;
    }

    // =====================================================
    // Resume Match
    // =====================================================

    public List<ResumeMatchDto> getResumeMatches() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        JobApplyEntity latestResume =
                jobApplyRepository
                        .findTopByStudentOrderByAppliedAtDesc(student)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Please upload a resume first."));

        String resumeText =
                resumeParser.extractText(
                        latestResume.getResumePath()
                );

        List<AddJobEntity> jobs =
                addJobRepository
                        .findByStatusAndDeadlineGreaterThanEqual(
                                "ACTIVE",
                                LocalDate.now()
                        );

        List<ResumeMatchDto> response =
                new ArrayList<>();
        for (AddJobEntity job : jobs) {

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

            ResumeMatchDto dto = new ResumeMatchDto();

            dto.setJobId(job.getId());

            dto.setCompanyName(job.getCompanyName());

            dto.setLocation(job.getLocation());

            dto.setJobRole(job.getJobRoleOverview());

            dto.setDeadline(job.getDeadline());

            dto.setMatchPercentage(percentage);

            response.add(dto);
        }

        return response;
    }

}