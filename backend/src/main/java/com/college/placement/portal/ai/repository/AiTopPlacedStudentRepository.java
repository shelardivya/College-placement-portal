package com.college.placement.portal.ai.repository;

import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiTopPlacedStudentRepository
        extends JpaRepository<TopPlacedStudentEntity, Long> {
}