package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.PlacementStoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlacementStoryRepository
        extends JpaRepository<PlacementStoryEntity, Long> {

    // Latest Story First
    List<PlacementStoryEntity> findAllByOrderByCreatedAtDesc();

}