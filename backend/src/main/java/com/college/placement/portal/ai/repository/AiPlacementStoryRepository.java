package com.college.placement.portal.ai.repository;

import com.college.placement.portal.admin.entity.PlacementStoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiPlacementStoryRepository
        extends JpaRepository<PlacementStoryEntity, Long> {
}