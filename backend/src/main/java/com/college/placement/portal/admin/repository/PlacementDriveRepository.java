package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.PlacementDriveEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PlacementDriveRepository
        extends JpaRepository<PlacementDriveEntity, Long> {

    List<PlacementDriveEntity> findAllByOrderByDriveDateAscDriveTimeAsc();

    List<PlacementDriveEntity> findByDriveDateGreaterThanEqualOrderByDriveDateAscDriveTimeAsc(
            LocalDate date
    );

}