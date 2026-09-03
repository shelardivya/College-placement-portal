package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.StudentQueryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentQueryRepository
        extends JpaRepository<StudentQueryEntity, Long> {

    // ==========================================
    // Student ki saari queries - Latest First
    // Existing method - isko mat hatao
    // ==========================================

    List<StudentQueryEntity> findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );

    // ==========================================
    // Student - Discarded queries ko hide karne ke liye
    // ==========================================

    List<StudentQueryEntity>
    findByStudentIdAndStatusNotOrderByCreatedAtDesc(
            Long studentId,
            String status
    );

    // ==========================================
    // Admin - All Queries - Latest First
    // ==========================================

    List<StudentQueryEntity> findAllByOrderByCreatedAtDesc();

    // ==========================================
    // Admin - Pending Queries
    // ==========================================

    List<StudentQueryEntity> findByStatusOrderByCreatedAtDesc(
            String status
    );

    // ==========================================
    // Admin - All Queries Except Discarded
    // ==========================================

    List<StudentQueryEntity> findByStatusNotOrderByCreatedAtDesc(
            String status
    );
}