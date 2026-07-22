package com.college.placement.portal.admin.repository;

import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopPlacedStudentRepository
        extends JpaRepository<TopPlacedStudentEntity, Long> {

    // Highest Package -> Lowest Package
    List<TopPlacedStudentEntity> findAllByOrderByPackageLpaDesc();

}