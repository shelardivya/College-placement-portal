package com.college.placement.portal.admin.dto;

public class DepartmentCountDto {

    private String department;

    private long count;

    public DepartmentCountDto() {
    }

    public DepartmentCountDto(String department, long count) {
        this.department = department;
        this.count = count;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}