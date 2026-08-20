package com.college.placement.portal.ai.controller;

import com.college.placement.portal.ai.service.AiTestService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/test")
public class AiTestController {

    private final AiTestService ollamaAiService;

    public AiTestController(AiTestService aiTestService) {
        this.ollamaAiService = aiTestService;
    }

    @GetMapping
    public String test(@RequestParam String question) {
        return ollamaAiService.ask(question);
    }
}