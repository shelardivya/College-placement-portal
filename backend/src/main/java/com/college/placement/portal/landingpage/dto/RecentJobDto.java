package com.college.placement.portal.landingpage.dto;

public class RecentJobDto {

    private String companyName;
    private String jobRoleOverview;
    private String location;
    private String tag; // e.g. "Now Hiring"

    public RecentJobDto() {
    }

    public RecentJobDto(
            String companyName,
            String jobRoleOverview,
            String location,
            String tag
    ) {
        this.companyName = companyName;
        this.jobRoleOverview = jobRoleOverview;
        this.location = location;
        this.tag = tag;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}