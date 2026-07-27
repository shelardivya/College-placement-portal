package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddJobRequestDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import org.springframework.stereotype.Service;

@Service
public class AddJobService {

    private final AddJobRepository repository;

    public AddJobService(AddJobRepository repository) {
        this.repository = repository;
    }

    public AddJobEntity addJob(AddJobRequestDto dto) {

        AddJobEntity job = new AddJobEntity();

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

        if ("POST".equalsIgnoreCase(dto.getAction())) {
            job.setStatus("ACTIVE");
        } else {
            job.setStatus("DRAFT");
        }

        return repository.save(job);
    }
}
