package com.college.placement.portal.student.repository;

import com.college.placement.portal.student.entity.JobApplyEntity;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.admin.entity.AddJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplyRepository
        extends JpaRepository<JobApplyEntity, Long> {

    boolean existsByStudentAndJob(
            RegisterEntity student,
            AddJobEntity job
    );
}