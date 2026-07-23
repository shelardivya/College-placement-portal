package com.college.placement.portal.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public class AddPlacementDriveRequestDto {

    private String companyName;

    private String jobRole;

    private String location;

    private String venue;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate driveDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime driveTime;

    private String status;

    private String targetStudent;

    private String specificStudentName;

    // ==========================
    // Getter Setter
    // ==========================

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public LocalDate getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDate driveDate) {
        this.driveDate = driveDate;
    }

    public LocalTime getDriveTime() {
        return driveTime;
    }

    public void setDriveTime(LocalTime driveTime) {
        this.driveTime = driveTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetStudent() {
        return targetStudent;
    }

    public void setTargetStudent(String targetStudent) {
        this.targetStudent = targetStudent;
    }

    public String getSpecificStudentName() {
        return specificStudentName;
    }

    public void setSpecificStudentName(String specificStudentName) {
        this.specificStudentName = specificStudentName;
    }
}