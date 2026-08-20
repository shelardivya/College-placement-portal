package com.college.placement.portal.ai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class OllamaAiService {

    private final ChatClient chatClient;

    public OllamaAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String ask(String question) {

        if (question == null || question.trim().isEmpty()) {
            throw new IllegalArgumentException("Question is required.");
        }

        return chatClient
                .prompt()
                .user(question)
                .call()
                .content();
    }
}