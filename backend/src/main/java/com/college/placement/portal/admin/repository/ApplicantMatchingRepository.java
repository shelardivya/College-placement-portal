package com.college.placement.portal.admin.repository;

import com.college.placement.portal.student.entity.JobApplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicantMatchingRepository
        extends JpaRepository<JobApplyEntity, Long> {

    List<JobApplyEntity> findAllByOrderByAppliedAtDesc();

}