package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.StudentQueryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentQueryRepository
        extends JpaRepository<StudentQueryEntity, Long> {

    // Student ki saari queries (Latest First)
    List<StudentQueryEntity> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    // Admin - All Queries (Latest First)
    List<StudentQueryEntity> findAllByOrderByCreatedAtDesc();

    // Admin - Pending Queries
    List<StudentQueryEntity> findByStatusOrderByCreatedAtDesc(String status);

}