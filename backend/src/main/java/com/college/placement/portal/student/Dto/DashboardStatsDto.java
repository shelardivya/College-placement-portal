package com.college.placement.portal.student.Dto;

public class DashboardStatsDto {

    private String fullName;
    private String currentDay;
    private String currentDate;

    private int profileCompleted;

    private long selected;
    private long pending;
    private long rejected;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCurrentDay() {
        return currentDay;
    }

    public void setCurrentDay(String currentDay) {
        this.currentDay = currentDay;
    }

    public String getCurrentDate() {
        return currentDate;
    }

    public void setCurrentDate(String currentDate) {
        this.currentDate = currentDate;
    }

    public int getProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(int profileCompleted) {
        this.profileCompleted = profileCompleted;
    }

    public long getSelected() {
        return selected;
    }

    public void setSelected(long selected) {
        this.selected = selected;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }
}