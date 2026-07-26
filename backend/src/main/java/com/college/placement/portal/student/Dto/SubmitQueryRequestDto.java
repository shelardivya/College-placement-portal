package com.college.placement.portal.student.Dto;

import jakarta.validation.constraints.NotBlank;

public class SubmitQueryRequestDto {

    @NotBlank(message = "Subject is required.")
    private String subject;

    @NotBlank(message = "Description is required.")
    private String description;

    // ==========================
    // Getters & Setters
    // ==========================

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}