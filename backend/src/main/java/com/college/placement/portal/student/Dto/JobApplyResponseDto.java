package com.college.placement.portal.student.Dto;

public class JobApplyResponseDto {

    private String message;

    public JobApplyResponseDto() {
    }

    public JobApplyResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}