package com.college.placement.portal.admin.dto;

public class AdminDashboardStatsDto {

    private long activePosting;
    private double activePostingGrowth;

    private long totalStudents;
    private double studentGrowth;

    private long resumeReceived;
    private double resumeGrowth;

    public long getActivePosting() {
        return activePosting;
    }

    public void setActivePosting(long activePosting) {
        this.activePosting = activePosting;
    }

    public double getActivePostingGrowth() {
        return activePostingGrowth;
    }

    public void setActivePostingGrowth(double activePostingGrowth) {
        this.activePostingGrowth = activePostingGrowth;
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

    public long getResumeReceived() {
        return resumeReceived;
    }

    public void setResumeReceived(long resumeReceived) {
        this.resumeReceived = resumeReceived;
    }

    public double getResumeGrowth() {
        return resumeGrowth;
    }

    public void setResumeGrowth(double resumeGrowth) {
        this.resumeGrowth = resumeGrowth;
    }

}
