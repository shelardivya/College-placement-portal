package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.AddJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AddJobRepository extends JpaRepository<AddJobEntity, Long> {

    // student dashboard ke liye
    List<AddJobEntity> findByStatusAndDeadlineAfter(String status, LocalDate date);

    // Draft Module
    List<AddJobEntity> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
    Optional<AddJobEntity> findByIdAndStatus(Long id, String status);

    //for active jobs which dead line is not over for student job apply
    List<AddJobEntity> findByStatusAndDeadlineGreaterThanEqualOrderByCreatedAtDesc(
            String status,
            LocalDate deadline
    );
    List<AddJobEntity> findByStatusAndDeadlineGreaterThanEqual(
            String status,
            LocalDate date
    );
}
