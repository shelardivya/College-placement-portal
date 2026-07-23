package com.college.placement.portal.admin.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "placement_drive")
public class PlacementDriveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_role")
    private String jobRole;

    @Column
    private String location;

    @Column
    private String venue;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @Column(name = "drive_time")
    private LocalTime driveTime;

    @Column
    private String status;

    @Column(name = "target_student")
    private String targetStudent;

    @Column(name = "specific_student_name")
    private String specificStudentName;

    // ===========================
    // Getter Setter
    // ===========================

    public Long getId() {
        return id;
    }

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