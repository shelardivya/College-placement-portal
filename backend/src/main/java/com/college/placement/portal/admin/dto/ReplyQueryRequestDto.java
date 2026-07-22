package com.college.placement.portal.admin.dto;

import jakarta.validation.constraints.NotBlank;

public class ReplyQueryRequestDto {

    @NotBlank(message = "Reply is required.")
    private String reply;

    // ==========================
    // Getters & Setters
    // ==========================

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}