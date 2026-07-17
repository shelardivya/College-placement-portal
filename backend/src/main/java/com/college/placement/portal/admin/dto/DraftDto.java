package com.college.placement.portal.admin.dto;

public class DraftDto {

    private Long id;

    private String companyName;

    private String jobRoleOverview;

    private String savedTime;

    private String status;

    public DraftDto() {
    }

    public DraftDto(Long id,
                    String companyName,
                    String jobRoleOverview,
                    String savedTime,
                    String status) {

        this.id = id;
        this.companyName = companyName;
        this.jobRoleOverview = jobRoleOverview;
        this.savedTime = savedTime;
        this.status = status;
    }

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

    public String getJobRoleOverview() {
        return jobRoleOverview;
    }

    public void setJobRoleOverview(String jobRoleOverview) {
        this.jobRoleOverview = jobRoleOverview;
    }

    public String getSavedTime() {
        return savedTime;
    }

    public void setSavedTime(String savedTime) {
        this.savedTime = savedTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}