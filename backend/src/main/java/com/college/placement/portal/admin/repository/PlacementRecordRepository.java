package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlacementRecordRepository
        extends JpaRepository<PlacementRecordEntity, Long> {

    // Total Placed Students
    long count();

    // Highest Package
    @Query("SELECT COALESCE(MAX(p.packageLpa),0) FROM PlacementRecordEntity p")
    Double getHighestPackage();

    // Average Package
    @Query("SELECT COALESCE(AVG(p.packageLpa),0) FROM PlacementRecordEntity p")
    Double getAveragePackage();

    // ==========================================
    // Placement by CGPA
    // ==========================================

    List<PlacementRecordEntity> findAllByStatusIgnoreCase(String status);

}