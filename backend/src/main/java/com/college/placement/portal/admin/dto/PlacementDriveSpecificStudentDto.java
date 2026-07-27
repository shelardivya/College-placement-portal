package com.college.placement.portal.admin.dto;

public class PlacementDriveSpecificStudentDto {

    private Long id;

    private String fullName;

    public PlacementDriveSpecificStudentDto() {
    }

    public PlacementDriveSpecificStudentDto(Long id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}