package com.college.placement.portal.landingpage.service;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.entity.PlacementRecordEntity;
import com.college.placement.portal.admin.repository.AddJobRepository;
import com.college.placement.portal.admin.repository.PlacementRecordRepository;
import com.college.placement.portal.admin.repository.TopPlacedStudentRepository;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.landingpage.dto.LandingStatsDto;
import com.college.placement.portal.landingpage.dto.PlacementTrendDto;
import com.college.placement.portal.landingpage.dto.RecentJobDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class LandingPageService {

    private final RegisterRepository registerRepository;
    private final TopPlacedStudentRepository topPlacedStudentRepository;
    private final AddJobRepository addJobRepository;
    private final PlacementRecordRepository placementRecordRepository;

    public LandingPageService(
            RegisterRepository registerRepository,
            TopPlacedStudentRepository topPlacedStudentRepository,
            AddJobRepository addJobRepository,
            PlacementRecordRepository placementRecordRepository
    ) {
        this.registerRepository = registerRepository;
        this.topPlacedStudentRepository = topPlacedStudentRepository;
        this.addJobRepository = addJobRepository;
        this.placementRecordRepository = placementRecordRepository;
    }

    // =====================================================
    // PUBLIC STATS (Total Students / Placements / Companies / Rate)
    // =====================================================

    public LandingStatsDto getPublicStats() {

        long totalStudents =
                registerRepository.countByRole(Role.STUDENT);

        long totalPlacements =
                topPlacedStudentRepository.count();

        long totalCompanies =
                addJobRepository.countDistinctCompanyNames();

        double placementRate = 0;

        if (totalStudents > 0) {
            placementRate = (totalPlacements * 100.0) / totalStudents;
        }

        return new LandingStatsDto(
                totalStudents,
                totalPlacements,
                totalCompanies,
                Math.round(placementRate * 100.0) / 100.0
        );
    }

    // =====================================================
    // PLACEMENT TREND (last 7 months, rolling window)
    // =====================================================

    public List<PlacementTrendDto> getPlacementTrend() {

        List<PlacementRecordEntity> records =
                placementRecordRepository.findAll();

        // Count placements per calendar month
        Map<YearMonth, Long> countsByMonth = new LinkedHashMap<>();

        for (PlacementRecordEntity record : records) {

            if (record.getPlacementDate() == null) {
                continue;
            }

            YearMonth yearMonth =
                    YearMonth.from(record.getPlacementDate());

            countsByMonth.merge(yearMonth, 1L, Long::sum);
        }

        // Build a rolling window of the last 7 months (always up to date)
        List<PlacementTrendDto> trend = new ArrayList<>();

        YearMonth currentMonth = YearMonth.from(LocalDate.now());

        for (int i = 6; i >= 0; i--) {

            YearMonth month = currentMonth.minusMonths(i);

            String label =
                    month.getMonth()
                            .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            long count = countsByMonth.getOrDefault(month, 0L);

            trend.add(new PlacementTrendDto(label, count));
        }

        return trend;
    }

    // =====================================================
    // RECENT ACTIVITY (latest 3 active job postings)
    // =====================================================

    public List<RecentJobDto> getRecentActivity() {

        List<AddJobEntity> jobs =
                addJobRepository
                        .findByStatusAndDeadlineGreaterThanEqualOrderByCreatedAtDesc(
                                "ACTIVE",
                                LocalDate.now()
                        );

        List<RecentJobDto> response = new ArrayList<>();

        int limit = Math.min(3, jobs.size());

        for (int i = 0; i < limit; i++) {

            AddJobEntity job = jobs.get(i);

            response.add(new RecentJobDto(
                    job.getCompanyName(),
                    job.getJobRoleOverview(),
                    job.getLocation(),
                    "Now Hiring"
            ));
        }

        return response;
    }
}