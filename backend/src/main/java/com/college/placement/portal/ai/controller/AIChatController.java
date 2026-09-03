package com.college.placement.portal.ai.controller;

import com.college.placement.portal.ai.dto.AIChatRequestDto;
import com.college.placement.portal.ai.dto.AIChatResponseDto;
import com.college.placement.portal.ai.service.AIChatService;
import com.college.placement.portal.auth.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AIChatResponseDto> chat(
            @Valid @RequestBody AIChatRequestDto request,
            Authentication authentication
    ) {

        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(authority ->
                        authority.getAuthority().replace("ROLE_", ""))
                .orElse("");

        Long userId = null;

        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {

            userId = userDetails.getUser().getId();
        }

        AIChatResponseDto response =
                aiChatService.ask(
                        request.getQuestion(),
                        role,
                        userId
                );

        return ResponseEntity.ok(response);
    }
}