package com.college.placement.portal.admin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddTopPlacedStudentRequestDto {

    @NotBlank(message = "Student Name is required.")
    private String studentName;

    @NotBlank(message = "Company Name is required.")
    private String companyName;

    @NotNull(message = "Package is required.")
    @Min(value = 1, message = "Package must be greater than 0.")
    private Double packageLpa;

    @NotNull(message = "CGPA is required.")
    @Min(value = 0, message = "CGPA cannot be less than 0.")
    @Max(value = 10, message = "CGPA cannot be greater than 10.")
    private Double cgpa;

    @NotBlank(message = "Skills are required.")
    private String skills;

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

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
}