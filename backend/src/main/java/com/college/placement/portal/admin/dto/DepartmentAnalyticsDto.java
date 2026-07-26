package com.college.placement.portal.admin.dto;

import java.util.List;

public class DepartmentAnalyticsDto {

    private long totalStudents;

    private List<DepartmentCountDto> departments;

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public List<DepartmentCountDto> getDepartments() {
        return departments;
    }

    public void setDepartments(List<DepartmentCountDto> departments) {
        this.departments = departments;
    }
}