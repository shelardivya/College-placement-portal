package com.college.placement.portal.student.entity;

import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.auth.entity.RegisterEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_application")
public class JobApplyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student
    @ManyToOne
    @JoinColumn(name = "student_id")
    private RegisterEntity student;

    // Job
    @ManyToOne
    @JoinColumn(name = "job_id")
    private AddJobEntity job;

    // Resume

    private String resumeName;

    private String resumePath;

    // Status

    private String status;

    private LocalDateTime appliedAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public RegisterEntity getStudent() {
        return student;
    }

    public void setStudent(RegisterEntity student) {
        this.student = student;
    }

    public AddJobEntity getJob() {
        return job;
    }

    public void setJob(AddJobEntity job) {
        this.job = job;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}