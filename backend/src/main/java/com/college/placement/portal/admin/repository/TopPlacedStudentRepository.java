package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TopPlacedStudentRepository
        extends JpaRepository<TopPlacedStudentEntity, Long> {

    // Highest Package -> Lowest Package
    List<TopPlacedStudentEntity> findAllByOrderByPackageLpaDesc();

    // ==========================================
    // Dashboard Statistics
    // ==========================================

    // Total Placed Students
    long count();

    // Highest Package
    @Query("SELECT COALESCE(MAX(t.packageLpa), 0) FROM TopPlacedStudentEntity t")
    Double getHighestPackage();

    // Average Package
    @Query("SELECT COALESCE(AVG(t.packageLpa), 0) FROM TopPlacedStudentEntity t")
    Double getAveragePackage();

}