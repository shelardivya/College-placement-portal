package com.college.placement.portal.auth.repository;

import com.college.placement.portal.admin.dto.DepartmentCountDto;
import com.college.placement.portal.admin.dto.PlacementDriveSpecificStudentDto;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RegisterRepository extends JpaRepository<RegisterEntity, Long> {

    Optional<RegisterEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    Optional<RegisterEntity> findById(Long id);

    Optional<RegisterEntity> findByFullName(String fullName);
    List<RegisterEntity> findAllByRole(Role role);

    // ==========================================
    // Department Analytics
    // ==========================================

    @Query("""
       SELECT new com.college.placement.portal.admin.dto.DepartmentCountDto(
           r.department,
           COUNT(r)
       )
       FROM RegisterEntity r
       WHERE r.role = com.college.placement.portal.auth.entity.Role.STUDENT
       GROUP BY r.department
       ORDER BY COUNT(r) DESC
       """)
    List<DepartmentCountDto> getDepartmentAnalytics();

    // ==========================================
    // Dashboard Analytics
    // ==========================================

    long countByRole(Role role);

    long countByRoleAndCreatedAtBetween(
            Role role,
            LocalDateTime start,
            LocalDateTime end
    );
    @Query("""
       SELECT new com.college.placement.portal.admin.dto.PlacementDriveSpecificStudentDto(
            r.id,
            r.fullName
       )
       FROM RegisterEntity r
       WHERE r.role = com.college.placement.portal.auth.entity.Role.STUDENT
       ORDER BY r.fullName ASC
       """)
    List<PlacementDriveSpecificStudentDto> getPlacementDriveSpecificStudents();
}