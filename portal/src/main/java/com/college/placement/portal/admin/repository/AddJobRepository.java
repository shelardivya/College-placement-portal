package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.AddJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AddJobRepository extends JpaRepository<AddJobEntity, Long> {

    // student dashboard ke liye
    List<AddJobEntity> findByStatusAndDeadlineAfter(String status, LocalDate date);
}
