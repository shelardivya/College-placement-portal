package com.college.placement.portal.student.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class LatestJobDto {

    private Long id;

    private String companyName;

    private String location;

    private String jobRoleOverview;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate deadline;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobRoleOverview() {
        return jobRoleOverview;
    }

    public void setJobRoleOverview(String jobRoleOverview) {
        this.jobRoleOverview = jobRoleOverview;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
}