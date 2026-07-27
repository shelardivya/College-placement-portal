package com.college.placement.portal.admin.dto;

public class StudentAnalyticsDto {

    private long placedStudents;

    private double placementRate;

    private double highestPackage;

    private double averagePackage;

    // ==========================================
    // Dashboard Cards
    // ==========================================

    private long totalActivePosts;

    private double activePostsGrowth;

    private long totalStudents;

    private double studentGrowth;

    private long totalResumeReceived;

    private double resumeGrowth;

    public long getPlacedStudents() {
        return placedStudents;
    }

    public void setPlacedStudents(long placedStudents) {
        this.placedStudents = placedStudents;
    }

    public double getPlacementRate() {
        return placementRate;
    }

    public void setPlacementRate(double placementRate) {
        this.placementRate = placementRate;
    }

    public double getHighestPackage() {
        return highestPackage;
    }

    public void setHighestPackage(double highestPackage) {
        this.highestPackage = highestPackage;
    }

    public double getAveragePackage() {
        return averagePackage;
    }

    public void setAveragePackage(double averagePackage) {
        this.averagePackage = averagePackage;
    }

    public long getTotalActivePosts() {
        return totalActivePosts;
    }

    public void setTotalActivePosts(long totalActivePosts) {
        this.totalActivePosts = totalActivePosts;
    }

    public double getActivePostsGrowth() {
        return activePostsGrowth;
    }

    public void setActivePostsGrowth(double activePostsGrowth) {
        this.activePostsGrowth = activePostsGrowth;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public double getStudentGrowth() {
        return studentGrowth;
    }

    public void setStudentGrowth(double studentGrowth) {
        this.studentGrowth = studentGrowth;
    }

    public long getTotalResumeReceived() {
        return totalResumeReceived;
    }

    public void setTotalResumeReceived(long totalResumeReceived) {
        this.totalResumeReceived = totalResumeReceived;
    }

    public double getResumeGrowth() {
        return resumeGrowth;
    }

    public void setResumeGrowth(double resumeGrowth) {
        this.resumeGrowth = resumeGrowth;
    }
}