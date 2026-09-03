package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddJobRequestDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.util.NotificationHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddJobService {

    private final AddJobRepository repository;
    private final RegisterRepository registerRepository;
    private final NotificationHelper notificationHelper;

    public AddJobService(
            AddJobRepository repository,
            RegisterRepository registerRepository,
            NotificationHelper notificationHelper
    ) {
        this.repository = repository;
        this.registerRepository = registerRepository;
        this.notificationHelper = notificationHelper;
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

        AddJobEntity savedJob = repository.save(job);

// ==========================================
// Notify All Students
// ==========================================

        if ("ACTIVE".equalsIgnoreCase(savedJob.getStatus())) {

            List<RegisterEntity> students =
                    registerRepository.findAllByRole(Role.STUDENT);

            for (RegisterEntity student : students) {

                notificationHelper.createNotification(
                        student,
                        "STUDENT",
                        "New Job Posted",
                        savedJob.getCompanyName()
                                + " has posted a new job.\nRole : "
                                + savedJob.getJobRoleOverview()
                );

            }

        }

        return savedJob;
    }
}
