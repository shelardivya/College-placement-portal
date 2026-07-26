package com.college.placement.portal.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class AddJobRequestDto {

    private String companyName;
    private String jobRequirements;
    private String jobRoleOverview;

    private String degree;
    private String branch;
    private Double minCgpa;
    private String passingYear;
    private String experience;
    private String location;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate deadline;

    private String action; // POST / DRAFT

    // getters & setters

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobRequirements() { return jobRequirements; }
    public void setJobRequirements(String jobRequirements) { this.jobRequirements = jobRequirements; }

    public String getJobRoleOverview() { return jobRoleOverview; }
    public void setJobRoleOverview(String jobRoleOverview) { this.jobRoleOverview = jobRoleOverview; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getPassingYear() { return passingYear; }
    public void setPassingYear(String passingYear) { this.passingYear = passingYear; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}