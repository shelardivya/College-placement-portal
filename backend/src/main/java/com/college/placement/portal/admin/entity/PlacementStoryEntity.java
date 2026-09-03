package com.college.placement.portal.admin.entity;

import com.college.placement.portal.auth.entity.RegisterEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "placement_story")
public class PlacementStoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================
    // Student
    // ==========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private RegisterEntity student;

    // ==========================
    // Story Details
    // ==========================

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "package_lpa", nullable = false)
    private Double packageLpa;

    @Column(name = "success_story", nullable = false, columnDefinition = "TEXT")
    private String successStory;

    @Column(name = "photo_path")
    private String photoPath;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // ==========================
    // Getters & Setters
    // ==========================

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

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public String getSuccessStory() {
        return successStory;
    }

    public void setSuccessStory(String successStory) {
        this.successStory = successStory;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}