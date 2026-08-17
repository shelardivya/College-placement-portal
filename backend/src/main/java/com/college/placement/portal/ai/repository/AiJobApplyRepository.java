package com.college.placement.portal.ai.repository;

import com.college.placement.portal.student.entity.JobApplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiJobApplyRepository
        extends JpaRepository<JobApplyEntity, Long> {

    List<JobApplyEntity> findByStudent_Id(Long studentId);
}