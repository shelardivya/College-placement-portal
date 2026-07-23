package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.RecentPostDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecentPostService {

    private final AddJobRepository addJobRepository;

    public RecentPostService(AddJobRepository addJobRepository) {
        this.addJobRepository = addJobRepository;
    }

    // ===========================================
    // Recent Active Job Postings
    // ===========================================

    public List<RecentPostDto> getRecentPosts() {

        List<AddJobEntity> jobs =
                addJobRepository
                        .findByStatusAndDeadlineGreaterThanEqualOrderByCreatedAtDesc(
                                "ACTIVE",
                                LocalDate.now()
                        );

        List<RecentPostDto> response =
                new ArrayList<>();

        for (AddJobEntity job : jobs) {

            RecentPostDto dto =
                    new RecentPostDto();

            dto.setCompanyName(
                    job.getCompanyName()
            );

            dto.setLocation(
                    job.getLocation()
            );

            dto.setJobRole(
                    job.getJobRoleOverview()
            );

            dto.setDeadline(
                    job.getDeadline()
            );

            dto.setStatus(
                    job.getStatus()
            );

            response.add(dto);

        }

        return response;

    }

}