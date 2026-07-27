package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.CgpaPlacementDto;
import com.college.placement.portal.admin.dto.DepartmentAnalyticsDto;
import com.college.placement.portal.admin.dto.StudentAnalyticsDto;
import com.college.placement.portal.admin.dto.TopSkillDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.admin.repository.PlacementRecordRepository;
import com.college.placement.portal.admin.repository.TopPlacedStudentRepository;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.college.placement.portal.student.repository.JobApplyRepository;
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
    private final TopPlacedStudentRepository topPlacedStudentRepository;
    private final JobApplyRepository jobApplyRepository;
    public StudentAnalyticsService(
            PlacementRecordRepository placementRecordRepository,
            RegisterRepository registerRepository,
            AddJobRepository addJobRepository,
            TopPlacedStudentRepository topPlacedStudentRepository,
            JobApplyRepository jobApplyRepository
    ) {
        this.placementRecordRepository = placementRecordRepository;
        this.registerRepository = registerRepository;
        this.addJobRepository = addJobRepository;
        this.topPlacedStudentRepository = topPlacedStudentRepository;
        this.jobApplyRepository = jobApplyRepository;
    }

    // ==========================================
    // Dashboard Stat Cards
    // ==========================================
    public StudentAnalyticsDto getDashboardStats() {

        StudentAnalyticsDto dto = new StudentAnalyticsDto();

        // ==========================================
        // Placement Cards
        // ==========================================

        long placedStudents = topPlacedStudentRepository.count();

        long totalStudents = registerRepository.countByRole(Role.STUDENT);

        double placementRate = 0;

        if (totalStudents > 0) {
            placementRate = (placedStudents * 100.0) / totalStudents;
        }

        Double highestPackage = topPlacedStudentRepository.getHighestPackage();

        Double averagePackage = topPlacedStudentRepository.getAveragePackage();

        dto.setPlacedStudents(placedStudents);
        dto.setPlacementRate(Math.round(placementRate * 100.0) / 100.0);
        dto.setHighestPackage(highestPackage);
        dto.setAveragePackage(Math.round(averagePackage * 100.0) / 100.0);

        // ==========================================
        // Date Range
        // ==========================================

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime firstDayCurrentMonth =
                now.withDayOfMonth(1)
                        .withHour(0)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0);

        LocalDateTime firstDayLastMonth =
                firstDayCurrentMonth.minusMonths(1);

        // ==========================================
        // Active Posts
        // ==========================================

        long totalActivePosts =
                addJobRepository.countByStatusIgnoreCase("ACTIVE");

        long lastMonthActivePosts =
                addJobRepository.countLastMonthActiveJobs(
                        firstDayLastMonth,
                        firstDayCurrentMonth
                );

        double activeGrowth = 0;

        if (lastMonthActivePosts > 0) {
            activeGrowth =
                    ((totalActivePosts - lastMonthActivePosts) * 100.0)
                            / lastMonthActivePosts;
        }

        dto.setTotalActivePosts(totalActivePosts);
        dto.setActivePostsGrowth(
                Math.round(activeGrowth * 100.0) / 100.0
        );

        // ==========================================
        // Students
        // ==========================================

        long lastMonthStudents =
                registerRepository.countByRoleAndCreatedAtBetween(
                        Role.STUDENT,
                        firstDayLastMonth,
                        firstDayCurrentMonth
                );

        double studentGrowth = 0;

        if (lastMonthStudents > 0) {
            studentGrowth =
                    ((totalStudents - lastMonthStudents) * 100.0)
                            / lastMonthStudents;
        }

        dto.setTotalStudents(totalStudents);
        dto.setStudentGrowth(
                Math.round(studentGrowth * 100.0) / 100.0
        );

        // ==========================================
        // Resume Received
        // ==========================================

        long totalResume =
                jobApplyRepository.count();

        long lastMonthResume =
                jobApplyRepository.countByAppliedAtBetween(
                        firstDayLastMonth,
                        firstDayCurrentMonth
                );

        double resumeGrowth = 0;

        if (lastMonthResume > 0) {
            resumeGrowth =
                    ((totalResume - lastMonthResume) * 100.0)
                            / lastMonthResume;
        }

        dto.setTotalResumeReceived(totalResume);
        dto.setResumeGrowth(
                Math.round(resumeGrowth * 100.0) / 100.0
        );

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