package com.college.placement.portal.landingpage.dto;

public class LandingStatsDto {

    private long totalStudents;
    private long totalPlacements;
    private long totalCompanies;
    private double placementRate;

    public LandingStatsDto() {
    }

    public LandingStatsDto(
            long totalStudents,
            long totalPlacements,
            long totalCompanies,
            double placementRate
    ) {
        this.totalStudents = totalStudents;
        this.totalPlacements = totalPlacements;
        this.totalCompanies = totalCompanies;
        this.placementRate = placementRate;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalPlacements() {
        return totalPlacements;
    }

    public void setTotalPlacements(long totalPlacements) {
        this.totalPlacements = totalPlacements;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public double getPlacementRate() {
        return placementRate;
    }

    public void setPlacementRate(double placementRate) {
        this.placementRate = placementRate;
    }
}