package com.college.placement.portal.admin.entity;

import com.college.placement.portal.auth.entity.RegisterEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "placement_record")
public class PlacementRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===========================
    // Student
    // ===========================

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private RegisterEntity student;

    // ===========================
    // Placement Details
    // ===========================

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "package_lpa", nullable = false)
    private Double packageLpa;

    @Column(name = "job_role")
    private String jobRole;

    @Column(name = "placement_date")
    private LocalDate placementDate;

    @Column(nullable = false)
    private String status;

    // ===========================
    // Getters & Setters
    // ===========================

    public Long getId() {
        return id;
    }

    public RegisterEntity getStudent() {
        return student;
    }

    public void setStudent(RegisterEntity student) {
        this.student = student;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public LocalDate getPlacementDate() {
        return placementDate;
    }

    public void setPlacementDate(LocalDate placementDate) {
        this.placementDate = placementDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}