package com.college.placement.portal.ai.controller;

import com.college.placement.portal.ai.service.OllamaAiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/test")
public class AiTestController {

    private final OllamaAiService ollamaAiService;

    public AiTestController(OllamaAiService ollamaAiService) {
        this.ollamaAiService = ollamaAiService;
    }

    @GetMapping
    public String test(@RequestParam String question) {
        return ollamaAiService.ask(question);
    }
}