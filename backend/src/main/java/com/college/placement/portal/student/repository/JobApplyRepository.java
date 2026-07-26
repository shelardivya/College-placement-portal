package com.college.placement.portal.student.repository;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.student.entity.JobApplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobApplyRepository
        extends JpaRepository<JobApplyEntity, Long> {

    boolean existsByStudentAndJob(
            RegisterEntity student,
            AddJobEntity job
    );

    Optional<JobApplyEntity> findTopByStudentOrderByAppliedAtDesc(
            RegisterEntity student
    );

    long countByStudentAndStatus(
            RegisterEntity student,
            String status
    );

    long countByStudentAndStatusIgnoreCase(
            RegisterEntity student,
            String status
    );

    long countByStudent(RegisterEntity student);
}