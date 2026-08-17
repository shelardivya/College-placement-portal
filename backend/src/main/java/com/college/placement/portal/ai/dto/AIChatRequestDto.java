package com.college.placement.portal.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIChatRequestDto {

    @NotBlank(message = "Question is required")
    private String question;
}