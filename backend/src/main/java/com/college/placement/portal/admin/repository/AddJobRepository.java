package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.AddJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AddJobRepository extends JpaRepository<AddJobEntity, Long> {

    // student dashboard ke liye
    List<AddJobEntity> findByStatusAndDeadlineAfter(String status, LocalDate date);

    // Draft Module
    List<AddJobEntity> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);

    Optional<AddJobEntity> findByIdAndStatus(Long id, String status);

    // for active jobs whose deadline is not over
    List<AddJobEntity> findByStatusAndDeadlineGreaterThanEqualOrderByCreatedAtDesc(
            String status,
            LocalDate deadline
    );

    List<AddJobEntity> findByStatusAndDeadlineGreaterThanEqual(
            String status,
            LocalDate date
    );

    // ==========================================
    // Dashboard Analytics
    // ==========================================

    // Total Active Posts
    long countByStatusIgnoreCase(String status);

    // Active Posts Created Between Dates
    long countByStatusIgnoreCaseAndCreatedAtBetween(
            String status,
            LocalDateTime start,
            LocalDateTime end
    );

    // Last Month Active Posts
    @Query("""
            SELECT COUNT(j)
            FROM AddJobEntity j
            WHERE LOWER(j.status) = 'active'
            AND j.createdAt >= :startDate
            AND j.createdAt < :endDate
            """)
    long countLastMonthActiveJobs(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}