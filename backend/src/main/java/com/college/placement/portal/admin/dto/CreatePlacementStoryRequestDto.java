package com.college.placement.portal.admin.dto;

import org.springframework.web.multipart.MultipartFile;

public class CreatePlacementStoryRequestDto {

    private String studentName;

    private String companyName;

    private String jobRole;

    private Double packageLpa;

    private String successStory;

    private MultipartFile photo;

    // ==========================
    // Getters & Setters
    // ==========================

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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

    public MultipartFile getPhoto() {
        return photo;
    }

    public void setPhoto(MultipartFile photo) {
        this.photo = photo;
    }
}