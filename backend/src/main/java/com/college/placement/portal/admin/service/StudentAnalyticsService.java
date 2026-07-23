package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.CgpaPlacementDto;
import com.college.placement.portal.admin.dto.DepartmentAnalyticsDto;
import com.college.placement.portal.admin.dto.StudentAnalyticsDto;
import com.college.placement.portal.admin.dto.TopSkillDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.admin.repository.PlacementRecordRepository;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Comparator;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentAnalyticsService {

    private final PlacementRecordRepository placementRecordRepository;
    private final RegisterRepository registerRepository;
    private final AddJobRepository addJobRepository;
    public StudentAnalyticsService(
            PlacementRecordRepository placementRecordRepository,
            RegisterRepository registerRepository,
            AddJobRepository addJobRepository
    ) {
        this.placementRecordRepository = placementRecordRepository;
        this.registerRepository = registerRepository;
        this.addJobRepository = addJobRepository;
    }

    // ==========================================
    // Dashboard Stat Cards
    // ==========================================

    public StudentAnalyticsDto getDashboardStats() {

        StudentAnalyticsDto dto = new StudentAnalyticsDto();

        long placedStudents = placementRecordRepository.count();

        long totalStudents = registerRepository.findAll()
                .stream()
                .filter(student -> student.getRole() == Role.STUDENT)
                .count();

        double placementRate = 0;

        if (totalStudents > 0) {
            placementRate = (placedStudents * 100.0) / totalStudents;
        }

        Double highestPackage = placementRecordRepository.getHighestPackage();
        Double averagePackage = placementRecordRepository.getAveragePackage();

        dto.setPlacedStudents(placedStudents);
        dto.setPlacementRate(Math.round(placementRate * 100.0) / 100.0);
        dto.setHighestPackage(highestPackage);
        dto.setAveragePackage(Math.round(averagePackage * 100.0) / 100.0);

        return dto;
    }

    // ==========================================
// Department Distribution
// ==========================================

    public DepartmentAnalyticsDto getDepartmentAnalytics() {

        DepartmentAnalyticsDto dto = new DepartmentAnalyticsDto();

        dto.setTotalStudents(
                registerRepository.countByRole(Role.STUDENT)
        );

        dto.setDepartments(
                registerRepository.getDepartmentAnalytics()
        );

        return dto;
    }
    // ==========================================
// Placement by CGPA
// ==========================================

    public List<CgpaPlacementDto> getPlacementByCgpa() {

        List<PlacementRecordEntity> placedStudents =
                placementRecordRepository.findAllByStatusIgnoreCase("PLACED");

        long below6 = 0;
        long between6And7 = 0;
        long between7And8 = 0;
        long between8And9 = 0;
        long between9And10 = 0;

        for (PlacementRecordEntity placement : placedStudents) {

            Double cgpa = placement.getStudent().getCgpa();

            if (cgpa == null) {
                continue;
            }

            if (cgpa < 6) {
                below6++;
            }
            else if (cgpa < 7) {
                between6And7++;
            }
            else if (cgpa < 8) {
                between7And8++;
            }
            else if (cgpa < 9) {
                between8And9++;
            }
            else {
                between9And10++;
            }

        }

        List<CgpaPlacementDto> response = new ArrayList<>();

        response.add(new CgpaPlacementDto("<6", below6));
        response.add(new CgpaPlacementDto("6-7", between6And7));
        response.add(new CgpaPlacementDto("7-8", between7And8));
        response.add(new CgpaPlacementDto("8-9", between8And9));
        response.add(new CgpaPlacementDto("9-10", between9And10));

        return response;
    }

    // ==========================================
// Top Skills In Demand
// ==========================================

    public List<TopSkillDto> getTopSkills() {

        List<AddJobEntity> jobs =
                addJobRepository.findAll();

        Map<String, Long> skillCount = new HashMap<>();

        for (AddJobEntity job : jobs) {

            if (job.getJobRequirements() == null ||
                    job.getJobRequirements().isBlank()) {
                continue;
            }
            String[] skills = job.getJobRequirements().split("[,\n\r]+");

            for (String skill : skills) {

                String value = skill.trim();

                if (value.isEmpty()) {
                    continue;
                }

                skillCount.put(
                        value,
                        skillCount.getOrDefault(value, 0L) + 1
                );

            }

        }

        List<TopSkillDto> response =
                new ArrayList<>();

        skillCount.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(
                        Comparator.reverseOrder()))
                .limit(10)
                .forEach(entry -> response.add(
                        new TopSkillDto(
                                entry.getKey(),
                                entry.getValue()
                        )
                ));

        return response;

    }
}