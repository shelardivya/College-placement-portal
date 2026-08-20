package com.college.placement.portal.ai.repository;

import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiPlacementRecordRepository
        extends JpaRepository<PlacementRecordEntity, Long> {
}