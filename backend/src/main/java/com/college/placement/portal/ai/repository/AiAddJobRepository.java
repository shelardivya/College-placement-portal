package com.college.placement.portal.ai.repository;

import com.college.placement.portal.admin.entity.AddJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiAddJobRepository extends JpaRepository<AddJobEntity, Long> {
}